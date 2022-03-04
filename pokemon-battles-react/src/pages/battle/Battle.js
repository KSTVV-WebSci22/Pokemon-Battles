import { useState, useEffect, useRef, useContext } from 'react';
import './Battle.css'
import axios from 'axios'
import Moves from './components/Moves';
import { ClientContext } from '../../context/ClientContext';

const Battle = () => {

    const [battle, setBattle] = useState(false)
    const [pokemon, setPokemon] = useState(false)
    const [pokemons, setPokemons] = useState([])
    const [myPokemons, setMyPokemons] = useState([])
    const signatureRef = useRef(null);

    const{ setSong } = useContext(ClientContext);

    useEffect(()=>{
      setSong(3)
    }, [])

    const getPokemon=(number)=>{
        axios.get('https://pokeapi.co/api/v2/pokemon/' + number)
            .then((response) => {              
                setPokemons([
                    {
                        "name": response.data.name,
                        "types": response.data.types,
                        "sprites": response.data.sprites,
                        "moves": response.data.moves,
                    }
                ]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getMyPokemon=(number)=>{
        axios.get('https://pokeapi.co/api/v2/pokemon/' + number)
            .then((response) => {              
                setMyPokemons([
                    {
                        "name": response.data.name,
                        "types": response.data.types,
                        "sprites": response.data.sprites,
                        "moves": response.data.moves,
                    }
                ]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        getPokemon(6)
        getMyPokemon(3)
    }, []);

    return ( <>

        <div id="battle" className="full-screen">
            {console.log("test rendering")}
            {/* Top View */}
            <div id="battle-view" className='battle-top'>

                {/* Opponent Players Pokemon */}
                <div id="opponent-pokemon-box">
                    <div id="opponent-pokemon">
                        {pokemons[0] && 
                            <>
                            <div id="opponent-pokemon-name">
                                {pokemons[0].name}
                                <span id="opponent-pokemon-stats">Lv. 70</span>
                            </div>
                            <div id="opponent-pokemon-health">
                                health bar goes here
                            </div>
                            </>
                        }
                    </div>
                </div>
                <div id="opponent-pokemon-img">
                    {pokemons[0] && 
                        <img src={pokemons[0].sprites.front_default} alt="" />
                    }
                </div>

                {/* Players Pokemon */}
                <div id="player-pokemon-img">
                    {myPokemons[0] && 
                        <img src={myPokemons[0].sprites.back_default} alt="" />
                    }
                </div>
                <div id="player-pokemon-box">
                    <div id="player-pokemon">
                        {myPokemons[0] &&
                            <>
                            <div id="my-pokemon-name">
                                {myPokemons[0].name} 
                                <span id="my-pokemon-stats">Lv. 68</span>
                            </div>
                            <div id="player-pokemon-health">
                                Health bar goes here
                            </div>
                            </>
                        }
                    </div>
                </div>
            </div>

            {/* Battle Menu */}
            {!battle && !pokemon && 
                <div id="battle-buttons" className='battle-bottom'>
                    <button 
                        onClick={()=>{setBattle(true)}}
                        id="move-selection"
                    >Fight</button>
                    <button 
                        id="pokemon-selection"
                        onClick={()=>{setPokemon(true)}}
                    >Pokemon</button>
                </div>
            }

            {battle && 
                <div id="battle-options" className='battle-bottom'>
                    {myPokemons[0] && myPokemons[0].moves.slice(0,4).map(i => {
                        return <Moves url={i.move.url}/>
                    })}
                    <button 
                        className="moves cancel shadow"
                        onClick={()=>{setBattle(false)}}
                    ><div>Cancel</div></button> 
                </div>   
            }

            {pokemon && 
                <div id="battle-options" className='battle-bottom'>
                    {
                        [1,2,3,4,5,6].map((item)=>{
                            return <button className="pokemon-select">{item}</button>
                        })
                    }
                    
                    <button 
                        className="pokemon-select"
                        onClick={()=>{setPokemon(false)}}
                    ><span>Cancel</span></button> 
                </div>   
            }
        </div>
        </>
     );
}
 
export default Battle;