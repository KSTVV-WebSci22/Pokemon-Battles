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




  return (
  <div className='content'>
    <Back name="Back" to="/welcome" />
    <div id="party" className='content-item'>
      <Navbar />
      <Row className="party-pokemon-list">
        <h3 xs={12} className='yellow-text'>Your Party</h3>
        {pokemon && pokemon.slice(0,6).map((poke, index) => {
          return (
            <Col xs={12} md={6} lg={4}>
              <PokemonStats poke={poke} showMoves={true} list={pokemon} index={index} updateList={getList}/>
            </Col>
          )
        })}

        <h3 xs={12} className='yellow-text'>Pokemon in Storage</h3>

        {pokemon && pokemon.slice(6).map((poke, index) => {
          return (
            <Col xs={12} md={6} lg={4}>
              <PokemonStats poke={poke} showMoves={true} list={pokemon} index={index + 6}/>
            </Col>
          )
        })}
      </Row>
    </div>
  </div>
  );
}
 
export default Party;