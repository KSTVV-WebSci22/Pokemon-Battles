import './party.css'
import Back from '../../components/Back'
import { useEffect, useState } from 'react'
import {Row, Col} from 'react-bootstrap'
import PokemonStats from '../../components/PokemonStats'


// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'


const Party = () => {

  const [pokemon, setPokemon] = useState([])

  const getList = async () => {
    const myPokemon = await getMyPokemon(auth.currentUser.uid)
    setPokemon(myPokemon)
  }

  useEffect(() => {
    getList()
  }, []);

  return (
  <div className='content'>
    <Back name="Back" to="/welcome" />
    <div id="party" className='content-item'>
      <h3 className='yellow-text'>Your Party</h3>
      {pokemon && pokemon.map((poke) => {
        return <PokemonStats poke={poke}/>
      })}
    </div>
  </div>
  );
}
 
export default Party;