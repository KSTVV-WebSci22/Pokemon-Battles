import { useState, useEffect, useRef, useContext } from 'react';
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
    const [loading, setLoading] = useState(true);

    const { setSong, website } = useContext(ClientContext);

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
        setMyPokemon(mycPokemon.slice(0, 6));
        console.log(mycPokemon);
        var hp = [];
        for(let x in mycPokemon){
            hp.push(100);
        }
        setMyHp(hp);
    }

    //when your opponent takes their turn
    const recieveTurn=() => { 
        console.log("recieveTurn");
        //test recieved oppenent data
        const opponent = {
            name: "Opponent",
            pokemon: "pikachu",
            hp: 100,
            level: 7,
            move: {
                name: "Thunderbolt",
                type: "Normal",
                pp: 50
            },
            won: null,
        }
        setMyOpponent(opponent);

        //if opponent lost
        if(opponent.won == false) {
            setWon(true);
            next("ENDGAME");
            setMyTurn(false);
            return 0;
        }

        if(opponent.move != null) {
            //will have to calculate damage from type & pp / other stats
            myHp[selectedPokemon] -= opponent.move.pp;
            console.log(myHp);
            
            let max = -1;
            //if pokemon died switch pokemon
            if(myHp[selectedPokemon] == 0) {
                myHp.every((x, i) => {
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
                    sendTurn();
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
        }
    }

    const sendTurn = async () => { 
        let move = null;
        if (selectedMove != -1) {
            move = {
                name: myPokemon[selectedPokemon].moves[selectedMove].name,
                type: myPokemon[selectedPokemon].moves[selectedMove].type,
                pp: myPokemon[selectedPokemon].moves[selectedMove].pp
            }
        }
        const turn = {
            name: "Me",
            pokemon: myPokemon[selectedPokemon].identifier,
            hp: myHp[selectedPokemon],
            level: myPokemon[selectedPokemon].level,
            move: move,
            won: won,
        }
        //send turn here
        console.log(turn);

        if(myTurn) {
            setMyTurn(false);
        }
    }

    useEffect(()=>{
        // test data represents your pokemon
        var testData = [
            {
                pokemon: 1,
                level: 6,
                moves: [1, 2, 3, 4]
            },
            {
                pokemon: 2,
                level: 6,
                moves: [5, 6, 7, 8]
            },
            {
                pokemon: 3,
                level: 6,
                moves: [9, 10, 11, 12]
            },
            {
                pokemon: 4,
                level: 6,
                moves: [13, 14, 15, 16]
            },
            {
                pokemon: 5,
                level: 6,
                moves: [17, 18, 19, 20]
            },
            {
                pokemon: 6,
                level: 6,
                moves: [21, 22, 23, 24]
            }
        ];

        //setMyPokemonData(testData); // Set pokemon test data
        //setMyHp([100, 100, 100, 100, 100, 100]); //initial hp percents
        setMyTurn(true); //you go first in this example false = opponent goes first

        //opponent initial test data
        setMyOpponent({
            name: "Opponent",
            pokemon: "pikachu",
            hp: 100,
            level: 7,
            move: null,
            won: null,
        });

        //get all info from api
        fillPokemon();
        //fillMoves(testData);

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
                        onClick={() => {sendTurn(); setMyTurn(false);}}
                        className="send"
                    >
                        Send my turn
                    </button>
                )
              } else {
                return (
                    <>
                        <h1 id="oppT">Opponent's Turn</h1>
                        <br/>
                        <button onClick={() => recieveTurn()}>
                            Send Opponent's turn (for testing)
                        </button>
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
            {myPokemon.length > 0 && myOpponent != null ? (
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
                                                {myOpponent.pokemon}
                                                <span id="opponent-pokemon-stats">{myOpponent.level}</span>
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
                                        <img src={require("../../img/pokemon/" + myOpponent.pokemon + ".png")} alt={myOpponent.pokemon} />
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