import './party.css'
import Back from '../../components/Back'
import { useEffect, useState, useContext } from 'react'
import PokemonStats from '../../components/PokemonStats'
import { Row, Col } from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext'

// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'
import Navbar from '../../components/Navbar'


const Party = () => {

  const [pokemon, setPokemon] = useState([])
  const{ setLoading } = useContext(ClientContext);

  const getList = async () => {
    const myPokemon = await getMyPokemon(auth.currentUser.uid)
    setPokemon(myPokemon)
  }

  useEffect(() => {
    getList()
    setLoading(false)
  }, []);

  const swapPokemon = async (arr, indexA, indexB) => {
    var temp = pokemon[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
  };


  return (
  <div className='content'>
    <Back name="Back" to="/welcome" />
    <div id="party" className='content-item'>
      <Navbar />
      <Row className="party-pokemon-list">
        <h3 xs={12} className='yellow-text'>Your Party</h3>
        {pokemon && pokemon.slice(0,6).map((poke) => {
          return (
            <Col xs={12} md={6} lg={4}>
              <PokemonStats poke={poke} showMoves={true}/>
            </Col>
          )
        })}

        <h3 xs={12} className='yellow-text'>Pokemon in Storage</h3>

        {pokemon && pokemon.slice(6).map((poke) => {
          return (
            <Col xs={12} md={6} lg={4}>
              <PokemonStats poke={poke} showMoves={true}/>
            </Col>
          )
        })}
      </Row>
    </div>
  </div>
  );
}
 
export default Party;