import { useState, useEffect, useRef, useContext } from 'react';
import './Battle.css'
import axios from 'axios'
import Moves from './components/Moves';
import { ClientContext } from '../../context/ClientContext';
import Loading from '../../components/Loading';

//xstate
import { createMachine, interpret, assign } from "xstate";
import { useMachine } from "@xstate/react";

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

    const [myPokemonData, setMyPokemonData] = useState([]); 
    const [myPokemon, setMyPokemon] = useState([]);
    const [myMoves, setMyMoves] = useState([]);
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

    const getPokemon = async (number) => {
        if(number != undefined) {
            return new Promise((res) => {
                axios.get(website + '/api/pokemon/'+ number).then(function (response) {
                    //console.log(response.data);
                    res(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            });
        }
    }

    const getMove = async (number) => {
        return new Promise((res) => {
            axios.get(website + '/api/move/'+ number).then(function (response) {
                //console.log(response.data);
                res(response.data);
            }).catch(function (error) {
                console.log(error);
            });
        });
    }

    const fillPokemon = async (testData) => { 
        var pokemon = [];
        for(const x of testData){
            const p = await getPokemon(x.pokemon);
            pokemon.push(p); 
        }
        setMyPokemon(pokemon);
        console.log(pokemon);
    }

    const fillMoves = async (testData) => { 
        var moves = [];
        var i = 0;
        for(const x of testData){
            moves.push([]);
            for(const y of x.moves){
                const m = await getMove(y);
                moves[i].push(m); 
            }
            i++;
        }
        setMyMoves(moves);
        console.log(moves);
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
                name: myMoves[selectedPokemon][selectedMove].name,
                type: myMoves[selectedPokemon][selectedMove].type,
                pp: myMoves[selectedPokemon][selectedMove].pp
            }
        }
        const turn = {
            name: "Me",
            pokemon: myPokemon[selectedPokemon].identifier,
            hp: myHp[selectedPokemon],
            level: myPokemonData[selectedPokemon].level,
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

        setMyPokemonData(testData); // Set pokemon test data
        setMyHp([100, 100, 100, 100, 100, 100]); //initial hp percents
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
        fillPokemon(testData);
        fillMoves(testData);

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
            console.log(myHp);
            return (
              <>
                <div id="battle-buttons" className='battle-bottom'>
                    <button id="move-selection" onClick={() => next("ATTACK")}>Attack</button>
                    <button id="pokemon-selection" onClick={() => next("SWITCH")}>Switch Pokemon</button>
                </div>
              </>
            );
          case "pickmove":
            return (
              <>
                <div id="battle-options" className='battle-bottom'>
                {myMoves[selectedPokemon] &&
                    [0, 1, 2, 3].map((x, i) => {
                    return (
                        <div
                        className="move"
                        key={x}
                        onClick={() => next({ type: "MOVE", id: i })}
                        >
                            <Moves moveData={myMoves[selectedPokemon][x]}/>
                        </div>
                    );
                    })}
                </div>
              </>
            );
          case "changepokemon":
            return (
              <>
                <div id="battle-options" className='battle-bottom pokemon-select'>
                    {myPokemon &&
                      myPokemon.map((x, i) => {
                        return (
                            <>
                                {myHp[i] > 0 ? (
                                    <>
                                        <button
                                            className="pokemon-btn"
                                            key={x.identifier}
                                            style={{backgroundColor: `var(--${(x.type1).toLowerCase()})`}}
                                            onClick={() => next({ type: "POKEMON", id: i })}
                                        >
                                            {x.identifier + " HP: " + myHp[i]}
                                        </button>
                                        <br/>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
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
                    >
                        Send my turn
                    </button>
                )
              } else {
                return (
                    <>
                        <h2>Opponent's Turn</h2>
                        <br/>
                        <button onClick={() => recieveTurn()}>
                            Send Opponent's turn
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
            {myPokemonData.length == 6 && myPokemon.length == 6 && myMoves.length == 6 && myOpponent != null ? (
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
                                                <span id="my-pokemon-stats">{myPokemonData[selectedPokemon].level}</span>
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
                                    {display(state.value)}
                                </>
                            ) : (
                                <>
                                    {display("endturn")}
                                </>
                            )}
                            {!state.matches("startturn") && !state.matches("endturn") ? (
                                <>
                                <button className="moves cancel shadow" onClick={() => next("CANCEL")}>Cancel</button>
                                </>
                            ) : (
                                <></>
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