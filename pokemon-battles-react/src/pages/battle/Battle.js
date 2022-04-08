import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import './Battle.css'
import axios from 'axios'
import Moves from './components/Moves';
import { ClientContext } from '../../context/ClientContext';
import Loading from '../../components/Loading';

//xstate
import { createMachine, interpret, assign } from "xstate";
import { useMachine } from "@xstate/react";

// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'
import { findBattle, createBattle, takeTurn, getTurns, newUser, sendLose } from '../../util/battle/Battle'
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
            DEAD: {
                target: "startturn",
                actions: "setpokemon"
            },
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
    const [loading, setLoading] = useState(true);
    const [uid, setUID] = useState("");
    const [name, setName] = useState("")

    const { setSong, website } = useContext(ClientContext);

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
            for(let x in mycPokemon){
                hp.push(100);
            }
            setMyHp(hp);
            res([mycPokemon.slice(0, 6)[0], hp]);
        })
    }

    const newBattle = async (pokemon, hp) => {
        const op = await findBattle();
        const myName = await getUser(auth.currentUser.uid); 
        var pokemonData = {...pokemon};
        delete pokemonData.moves;
        //moved from in if statement
        if(op != false) {
            console.log("Opponent => ", op.turns[0]);
            setDocId(op.docId);
            setMyOpponent(op.turns[0]);
            setName(myName);
            console.log("pd =>", pokemonData);
            let me = {
                hp: 100,
                pokemon: pokemonData,
                type: "start",
                userName: await myName.username,
                userId: await auth.currentUser.uid
            }
            console.log("Me => ", me);
            newUser(op.docId, auth.currentUser.uid); //uncomment when finished
            if(takeTurn(op.docId, me)) {
                setMyTurn(false);
                console.log("hp =>", myHp);
                recieveTurn(op.docId, auth.currentUser.uid, hp);
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
                            hp: 100,
                            type: "start",
                            pokemon: pokemonData,
                            userId: auth.currentUser.uid,
                            userName: myName.username,
                            time: new Date().getTime()
                        }
                    ]
                }
                console.log(battle);
                const newDoc = await createBattle(battle);
                setDocId(newDoc);
                console.log("hp =>", myHp);
                recieveTurn(newDoc, auth.currentUser.uid, hp);
            } else {
                navigate('/');
            }
            
        }
    }

    //when your opponent takes their turn
    const recieveTurn= async (dId, pId, hp) => { 
        console.log("in recieve");
        getTurns(dId, pId).then(turn => {
            if(turn.type != 'start') {
                console.log("Recieved Turn +> ", turn);

                setMyOpponent(turn);

                if(turn == "win") {
                    setWon(true);
                    next("ENDGAME");
                    setMyTurn(false);
                    return 0;
                }
        
                if(turn.move != null) {
                    //will have to calculate damage from type & pp / other stats
                    let newHp = [...hp];
                    newHp[selectedPokemon] -= turn.damage;
                    setMyHp(newHp);
                    console.log(newHp);
                    
                    let max = -1;
                    //if pokemon died switch pokemon
                    if(newHp[selectedPokemon] == 0) {
                        newHp.every((x, i) => {
                            if(x > 0) {
                                max = i;
                                return false;
                            }
                            return true;
                        });
                        //if all pokemon are dead you lose
                        if(max == -1) {
                            setWon(false);
                            next("ENDGAME");
                            setMyTurn(false);
                            sendLose(docId, myOpponent.userId);
                        } else {
                            //if a pokemon dead switch pokemon
                            next({ type: "DEAD", id: max }); 
                            setMyTurn(true);
                        }
                    } else {
                        //if pokemon not dead
                        next("NEWTURN");
                        setMyTurn(true);
        
                    }

                } else if (turn.move == null) {
                    next("NEWTURN");
                    setMyTurn(true);
                }
        } else if(turn.type == 'start') {
            console.log("Recieved Turn => ", turn);
            setMyOpponent(turn);
            setMyTurn(true);
        }
        });
    }

    const sendTurn = async (hp) => { 
        console.log("in send");
        const myName = await getUser(auth.currentUser.uid); 
        let move = null;
        let damage = null;
        if (selectedMove != -1) {
            move = myPokemon[selectedPokemon].moves[selectedMove];
            damage = 50;
        }
        var pokemonData = {...myPokemon[selectedPokemon]};
        delete pokemonData.moves;
        const turn = {
            userName: myName.username,
            userId: auth.currentUser.uid,
            pokemon: await pokemonData,
            hp: hp[selectedPokemon],
            move: move,
            damage: damage,
            won: won,
            type: "turn",
            time: new Date().getTime()
        }
        //send turn here
        console.log("myturn =>", turn);
        if(takeTurn(docId, turn)) {
            if(damage != null) {
                let opponent = {...myOpponent};
                opponent.hp -= damage;
                setMyOpponent(opponent);
            }
    
            if(myTurn) {
                setMyTurn(false);
            }
            recieveTurn(docId, auth.currentUser.uid, hp);
        };
    }

    useEffect(async ()=>{

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is Signed In
                setUID(user.uid);
                console.log(user.uid);

                //opponent initial test data
                /*
                setMyOpponent({
                    name: "Opponent",
                    pokemon: "pikachu", //change to pokemon info object
                    hp: 100,
                    level: 7,
                    move: null, //all move info
                    won: null,
                });*/

                //get all info from api
                fillPokemon().then((data)=>{
                    //firebase battle test
                    newBattle(data[0], data[1]);
                    //takeTurn("Mn0MedqRWwBYNaUfTJ8l", {}); //test send turn
                });

            } 
        })


      }, []);

    //xstate init
    const [state, send] = useMachine(turnMachine, actions);
    const { selectedPokemon, selectedMove } = state.context;

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
                <button id="move-selection" className="battle-buttons" onClick={() => next("ATTACK")}>Attack</button>
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
                                <div className={'pokemon ' + (myHp[i] > 0 ? '' : 'dead')} 
                                    style={{backgroundColor: `var(--${(x.type1).toLowerCase()})`,
                                    backgroundImage:
                                    `linear-gradient(
                                      to left,
                                      #C1C1C1 ${myHp[i] < 100 ? 100 - myHp[i] : ''}%,
                                      #ffffff00 0%
                                    )`}}
                                    key={x.identifier}
                                    onClick={(myHp[i] > 0 ? () => next({ type: "POKEMON", id: i }) : () => {})}
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
                                {/*<span className="hp">
                                    {" HP: " + myHp[i]}
                        </span>*/}
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
                        <h1 id="oppT">Opponent's Turn</h1>
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
            {/*change this to myPokemonData.length == 6 when finalized*/}
            {myPokemon.length > 0 && myOpponent != null && docId != null && myHp.length == myPokemon.length ? (
                <>
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
                                                {"HP: " + myOpponent.hp + "%"}
                                            </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div id="opponent-pokemon-img">
                                    {myOpponent && 
                                        <img src={require("../../img/pokemon/" + myOpponent.pokemon.identifier + ".png")} alt={myOpponent.pokemon.identifier} />
                                    }
                                </div>

                                {/* Players Pokemon */}
                                <div id="player-pokemon-img">
                                    {myPokemon[selectedPokemon] && 
                                        <img src={require("../../img/pokemon/" + myPokemon[selectedPokemon].identifier  + ".png")} alt={myPokemon[selectedPokemon].identifier}/>
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
                                                {"HP: " + myHp[selectedPokemon] + "%"}
                                            </div>
                                            </>
                                        }
                                    </div>
                                </div>
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
            ) : (
                <Loading/>
            )}
            </div>
        </div>
        
     );
}
 
export default Battle;