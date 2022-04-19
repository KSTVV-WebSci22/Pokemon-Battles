import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import './Battle.css'
import axios from 'axios'
import Moves from './components/Moves';
import { ClientContext } from '../../context/ClientContext';

//xstate
import { createMachine, interpret, assign } from "xstate";
import { useMachine } from "@xstate/react";

// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'
import { findBattle, createBattle, takeTurn, getTurns, newUser } from '../../util/battle/Battle'
import { onAuthStateChanged } from 'firebase/auth';
import { getUser, updateUser } from '../../util/users/Users';

//xstate machine
const turnMachine = createMachine({
    id: "turn",
    initial: "startturn",
    context: {
      selectedPokemon: 0,
      selectedMove: -1
    },
    states: {
      startturn: {
        on: {
          ATTACK: "pickmove",
          SWITCH: {
              target: "changepokemon",
              actions: assign({
                selectedMove: -1, 
              })
          },
          DEAD: {
            target: "startturn",
            actions: "setpokemon"
          }
        }
      },
      pickmove: {
        on: {
          MOVE: {
            target: "endturn",
            actions: "setmove"
          },
          CANCEL: {
            target: "startturn"
          }
        }
      },
      changepokemon: {
        on: {
          POKEMON: {
            target: "endturn",
            actions: "setpokemon"
          },
          CANCEL: {
            target: "startturn"
          }
        }
      },
      endturn: {
        on : {
            NEWTURN: "startturn",
            ENDGAME: "endgame"
        }
      },
      endgame: {
        type: "final"
      }
    }
});
  
const actions = {
    actions: {
        setpokemon: assign({
            selectedPokemon: (context, event) => event.id
        }),
        setmove: assign({
            selectedMove: (context, event) => event.id
        })
    }
};

const Battle = () => {

    const [myPokemon, setMyPokemon] = useState([]);
    const [myHp, setMyHp] = useState([]);
    const [won, setWon] = useState(null);
    const [myOpponent, setMyOpponent] = useState(null);
    const [myTurn, setMyTurn] = useState(true);
    const signatureRef = useRef(null);
    const [docId, setDocId] = useState(null);
    const [uid, setUID] = useState("");
    const [name, setName] = useState("");
    const [toast, setToast] = useState("hide");
    const [fainted, setFainted] = useState(false);
    const [showPokemon, setShowPokemon] = useState(true);

    const { setSong, setLoading } = useContext(ClientContext);

    let navigate = useNavigate();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigate('/');
        }
    });

    useEffect(()=>{
      setSong(3)
    }, []);

    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false)
        }, 1000)
    }, []);

    const fillPokemon = async () => { 
        const mycPokemon = await getMyPokemon(auth.currentUser.uid);
        return new Promise(res =>{
            setMyPokemon(mycPokemon.slice(0, 6));
            console.log(mycPokemon);
            var hp = [];
            mycPokemon.forEach(x => {
                hp.push(x.hp); 
            });
            setMyHp(hp);
            res([mycPokemon.slice(0, 6)[0], hp]);
        })
    }

    const newBattle = async (pokemon, hp) => {
        const op = await findBattle(auth.currentUser.uid);
        const myName = await getUser(auth.currentUser.uid); 
        var pokemonData = {...pokemon};
        delete pokemonData.moves;
        if(op != false) {
            console.log("Opponent => ", op.turns[0]);
            setDocId(op.docId);
            setMyOpponent(op.turns[0]);
            setName(myName);
            console.log("pd =>", pokemonData);
            let me = {
                hp: pokemonData.hp, 
                pokemon: pokemonData,
                type: "start",
                userName: await myName.username,
                userId: await auth.currentUser.uid
            }
            console.log("Me => ", me);
            newUser(op.docId, auth.currentUser.uid); 
            if(takeTurn(op.docId, me)) {
                setMyTurn(true);
            }
        } else {
            if(window.confirm("No battles found, start a new battle?")) {
                let battle = {
                    date: new Date().getTime(),
                    status: "started",
                    user1: auth.currentUser.uid,
                    user2: "",
                    winner: "",
                    turns: [
                        {
                            hp: pokemonData.hp,
                            type: "start",
                            pokemon: pokemonData,
                            userId: await auth.currentUser.uid,
                            time: new Date().getTime()
                        }
                    ]
                }
                console.log(battle);
                const newDoc = await createBattle(battle);
                setDocId(newDoc);
                console.log("hp =>", myHp);
                setMyTurn(true);
                recieveTurn(newDoc, auth.currentUser.uid, 0);
            } else {
                navigate('/');
            }
            
        }
    }

    //when your opponent takes their turn
    const recieveTurn = async (dId, pId, type) => { 
        return new Promise(res => {
            console.log("in recieve");
            getTurns(dId, pId, type).then(turn => {

                if(turn == "win") {
                    setWon(true);
                    next("ENDGAME");
                    setMyTurn(false);
                }
                if(turn == "lose") {
                    setWon(false);
                    next("ENDGAME");
                    setMyTurn(false);
                }

                if(turn.type != 'start') {
                    console.log("Recieved Turn => ", turn);

                    var newHp = [...myHp];
                    if(turn.turn1 == auth.currentUser.uid) {
                        newHp[selectedPokemon] = turn.turn1Hp;
                        setMyHp(newHp);
                        setMyOpponent({
                            hp: turn.turn2Hp,
                            pokemon: (turn.turn2Pokemon != null ? turn.turn2Pokemon : "Switching Pokemon"),
                            userId: turn.turn2,
                            summary: turn.turn2Summary
                        });
                        if(turn.turn2Hp == 0) {
                            sendTurn(newHp, 1);
                            res(true);
                        }
                    } else {
                        newHp[selectedPokemon] = turn.turn2Hp;
                        setMyHp(newHp);
                        setMyOpponent({
                            hp: turn.turn1Hp,
                            pokemon: (turn.turn1Pokemon != null ? turn.turn1Pokemon : "Switching Pokemon"),
                            userId: turn.turn1,
                            summary: turn.turn1Summary
                        });
                        if(turn.turn1Hp == 0) {
                            sendTurn(newHp, 1);
                            res(true);
                        }
                    }
                    if(newHp[selectedPokemon] == 0) {
                        setFainted(true);
                    }
                    next("NEWTURN");
                    setMyTurn(true);
                    res(true);
                } else if(turn.type == 'start') {
                    console.log("Recieved Turn => ", turn);
                    setMyOpponent(turn);
                    res(true);
                }
            });
        });
    }

    const sendTurn = async (hp, type = 0) => { 
        console.log("in send");
        const myName = await getUser(auth.currentUser.uid); 
        let move = null;
        let damage = null;
        let summary = "";
        var pokemonData = {...myPokemon[selectedPokemon]};
        delete pokemonData.moves;
        if (selectedMove != -1) {
            move = myPokemon[selectedPokemon].moves[selectedMove];
            //damage = await damageCalc();
        }
        var turn = {};
        if(type == 0) {
            turn = {
                move: move,
                type: (!fainted ? "turn" : "fainted-switch"),
            }
        } else {
            turn = {
                move: null,
                type: "opponent-fainted"
            }
        }
        //send turn here
        turn.userId = auth.currentUser.uid;
        turn.pokemon = await pokemonData;
        turn.hp = hp[selectedPokemon];
        turn.time = new Date().getTime();
        turn.damage = null;
        turn.pokemonLeft = hp.filter(x => x > 0).length;
        console.log("myturn =>", turn);
        if(takeTurn(docId, turn)) {
            if(myTurn) {
                setMyTurn(false);
                setFainted(false);
                recieveTurn(docId, auth.currentUser.uid, 1);
            }
        };
    }

    useEffect(async ()=>{

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is Signed In
                setUID(user.uid);
                console.log(user.uid);
                //get all info from api
                fillPokemon().then((data)=>{
                    newBattle(data[0], data[1]);
                });

            } 
        })


      }, []);

    //xstate init
    const [state, send] = useMachine(turnMachine, actions);
    const { selectedPokemon, selectedMove } = state.context;

    useEffect(()=>{
        if(myTurn /*&& myOpponent.summary != undefined*/) {
            setToast("show");
            const y = setTimeout(function(){
                setToast("hide");
            }, 6000);
        }
      }, [myTurn]);

      useEffect(()=>{
        if(!showPokemon) {
            setShowPokemon(true);
        }
      }, [selectedPokemon]);

    //xstate advance
    function next(string) {
        send(string);
        console.log(state);
    }

    //what to do based on state
    function display(value) {
        switch (value) {
          case "startturn":
            return (
              <>
                <button 
                    id="move-selection" 
                    className="battle-buttons" 
                    onClick={() => next("ATTACK")}
                    disabled={(fainted ? "true" : "")}
                    >
                        Attack
                </button>
                <button id="pokemon-selection" className="battle-buttons" onClick={() => next("SWITCH")}>Switch Pokemon</button>
              </>
            );
          case "pickmove":
            return (
              <>
                <div className="battle-grid">
                {myPokemon[selectedPokemon].moves &&
                    [0, 1, 2, 3].map((x, i) => {
                        if(myPokemon[selectedPokemon].moves[i] != undefined) {
                            return (
                                <div
                                className="move"
                                key={x}
                                onClick={() => next({ type: "MOVE", id: i })}
                                >
                                    <Moves moveData={myPokemon[selectedPokemon].moves[i]}/>
                                </div>
                            );
                        } else {
                            return (<></>);
                        }
                    })}
                </div>
              </>
            );
          case "changepokemon":
            return (
              <>
                <div id="pokemon-select" className='battle-grid'>
                    {myPokemon &&
                      myPokemon.map((x, i) => {
                        return (
                            <>
                                <div className={'pokemon ' + (myHp[i] > 0 ? (i == selectedPokemon ? 'selected' : '') : 'dead')} 
                                    style={{backgroundColor: `var(--${(x.type1).toLowerCase()})`,
                                    backgroundImage:
                                    `linear-gradient(
                                      to left,
                                      #C1C1C1 ${100 - ((myHp[i] / myPokemon[i].hp ) * 100)}%,
                                      #ffffff00 0%
                                    )`}}
                                    key={x.identifier}
                                    onClick={(myHp[i] > 0 && i != selectedPokemon ? () => {
                                        next({ type: "POKEMON", id: i });
                                        setShowPokemon(false);
                                    } : () => {})}
                                >
                                <img className="pokemon-select-img" src={require("../../img/pokemon/" + x.identifier  + ".png")} alt={x.identifier}/>
                                <span class="pokemon-info">
                                    <span className="pokemon-btn">
                                        <span>
                                            {x.identifier.charAt(0).toUpperCase() + x.identifier.slice(1)}
                                        </span>
                                        <span className="level" title='Pokemon Level'>
                                            {x.current_level}
                                            </span>
                                    </span>
                                    <span>
                                        <span className='pokemon-subtitle'>
                                            Type:
                                        </span>
                                        {' ' + x.type1}
                                        {x.type2 != 'None' ? ', ' + x.type2 : ''}
                                    </span>
                                    <span>
                                        <span className='pokemon-subtitle'>
                                            Moves: 
                                        </span>
                                        {x.moves.map((y, i) => {
                                            if(y != null) {
                                                if(i == 0) {
                                                    return (' ' + y.name)
                                                } else {
                                                    return (', ' + y.name)
                                                }
                                            } else {
                                                return ('')
                                            }
                                        })}
                                    </span>
                                </span>
                                </div>
                          </>
                        );
                      })}
                  </div>
              </>
            );
          case "endturn":
              if(myTurn) {
                return (
                    <button
                        onClick={() => {sendTurn(myHp); setMyTurn(false);}}
                        className="send"
                    >
                        Send my turn
                    </button>
                )
              } else {
                return (
                    <>
                        <h1 id="oppT">Waiting for Opponent...</h1>
                    </>
                );
              }
            
          default:
            return (<> </>);
        }
    }

    return ( 
        <div id="battle" className='content'>
            <div className='battle content-item'>
            {/*when all data has been recieved stop loading*/}
            {myPokemon.length > 0 && myOpponent != null && docId != null && myHp.length == myPokemon.length ? (
                <>
                    {setLoading(false)}
                    {won == null ? (
                        <>   
                            {/*battle view*/}
                            <div id="battle-view" className='battle-top'>

                                {/* Opponent Players Pokemon */}
                                <div id="opponent-pokemon-box">
                                    <div id="opponent-pokemon">
                                        {myOpponent && 
                                            <>
                                            <div id="opponent-pokemon-name">
                                                {myOpponent.pokemon.identifier}
                                                <span id="opponent-pokemon-stats">{myOpponent.pokemon.current_level}</span>
                                            </div>
                                            <div id="opponent-pokemon-health">
                                                {"HP: " + myOpponent.hp}
                                            </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div id="opponent-pokemon-img">
                                    {myOpponent && (myOpponent.pokemon != "Switching Pokemon") ? (
                                        <img src={require("../../img/pokemon/" + myOpponent.pokemon.identifier + ".png")} alt={myOpponent.pokemon.identifier} />
                                    ) : (
                                        <></>
                                    )
                                    }
                                </div>

                                {/* Players Pokemon */}
                                <div id="player-pokemon-img">
                                    {myPokemon[selectedPokemon] && showPokemon ? (
                                        <img src={require("../../img/pokemon/" + myPokemon[selectedPokemon].identifier  + ".png")} alt={myPokemon[selectedPokemon].identifier}/>
                                    ) : (<></>)
                                    }
                                    
                                </div>
                                <div id="player-pokemon-box">
                                    <div id="player-pokemon">
                                        {myPokemon[selectedPokemon] &&
                                            <>
                                            <div id="my-pokemon-name">
                                                {myPokemon[selectedPokemon].identifier} 
                                                <span id="my-pokemon-stats" title='Pokemon Level'>{myPokemon[selectedPokemon].current_level}</span>
                                            </div>
                                            <div id="player-pokemon-health">
                                                {"HP: " + myHp[selectedPokemon]}
                                            </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                {myOpponent.summary != undefined && myOpponent.summary != "" ? (
                                    <>
                                        {/*Opponent move toast notification*/}
                                        <div className="toast-container bg-background-color-red">
                                            <div id="liveToast" className={"toast " + toast} role="status" aria-live="polite" aria-atomic="true" data-delay="1000">
                                                <div class="d-flex">
                                                    <div class="toast-body">
                                                        {myOpponent.summary}
                                                    </div>
                                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                
                            </div>
                            {myTurn ? (
                                <>
                                    <div className='battle-bottom'>
                                        {display(state.value)}
                                        {!state.matches("startturn") && !state.matches("endturn") ? (
                                            <>
                                                <button className="cancel battle-buttons" onClick={() => next("CANCEL")}>Cancel</button>
                                            </>
                                        ) : (
                                                <></>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {<div className='battle-bottom'>
                                        {display("endturn")}
                                    </div>}
                                </>
                            )}
                            
                        </>
                    ) : (
                        <>
                            <p>{"You " + (won == true ? ("Win") : ("Lose"))}</p>
                        </>
                    )}
                </>
            ) : 
                <>
                    {setLoading(true)}
                </>
            }
            </div>
        </div>
        
     );
}
 
export default Battle;