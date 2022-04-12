import './party.css'
import Back from '../../components/Back'
import { useEffect, useState, useContext } from 'react'
import PokemonStats from '../../components/PokemonStats'
import { Row, Col } from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext'

// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'


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
      <Row>
        <h3 xs={12} className='yellow-text'>Your Party</h3>
        {pokemon && pokemon.slice(0,6).map((poke) => {
          return (
            <Col xs={12} md={6} lg={4}>
              <PokemonStats poke={poke} showMoves={true}/>
            </Col>
          )
      })}

      <h3 xs={12} className='yellow-text'>Pokemon in Storage</h3>

      {pokemon && pokemon.slice(0,6).map((poke) => {
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