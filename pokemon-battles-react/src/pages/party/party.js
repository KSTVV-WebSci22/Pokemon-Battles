import './party.css'
import Back from '../../components/Back'
import { useEffect, useState } from 'react'
import {Row, Col} from 'react-bootstrap'

// Firebase
import { auth } from '../../util/Firebase'
import { getMyPokemon } from '../../util/users/Users'


const Party = () => {

  const [pokemon, setPokemon] = useState([])

  const getList = async () => {
    const myPokemon = await getMyPokemon(auth.currentUser.uid)
    setPokemon(myPokemon)
  }

  const getMoves = (move) => {
    console.log(move)
    return move.map(m => {
      console.log(m)
      if(m) {
        return (
          <Col className="moves">
            <div className='d-flex w-100'>
              <div className="move">
                {m.name}
                <div className="power" style={{backgroundColor: `${m.type.toLowerCase()}`}} >
                  {m.pp}/{m.pp}
                </div>
              </div>
            </div>
          </Col>
        )
      } else {
        return (
          <Col className="moves">
            <div className='d-flex w-100'>
              <div className="move">
                Empty
                <div className="power" style={{backgroundColor: `black`}} >
                  none
                </div>
              </div>
            </div>
          </Col>
        )
      }
    })
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
        console.log(poke.type1)
        return(
          <div className='party-item'>
            <div className='party-img' >
              <img className="" src={require("../../img/pokemon/" + poke.identifier + ".png")} alt={"my pokemon"} />
            </div>
            <div className='party-words'>
              {/* Name */}
              <h2>
                <span style={{color: `var(--${poke.type1.toLowerCase()})`}}>
                  {poke.identifier}
                </span>
                <span className='party-level'>
                  {poke.current_level}
                </span>
              </h2>


              {/* Type */}
              <div className="party-text">
                <div className="yellow-text fw-bold">Type</div>
                <div>
                  <span className='party-type me-2'
                    style={{backgroundColor: `var(--${poke.type1.toLowerCase()})`}}
                  >{poke.type1}</span> 
                  {poke.type2 !== "None" ? 
                    <span className='party-type'
                      style={{backgroundColor: `var(--${poke.type2.toLowerCase()})`}}
                    >{poke.type2}</span> 
                    : ""}
                </div>
              </div>
              
              {/* Moves */}
              <div className='fw-bold mt-2 yellow-text'>Moves</div> 
              <Row className="row-cols-1">
                {getMoves(poke.moves)}
              </Row>
            </div>
          </div>
        )
      })
        
      }
    </div>
  </div>
  );
}
 
export default Party;