import './party.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import charizard from '../../img/pokemon/charizard1.png'
import machamp from '../../img/pokemon/machamp.png'
import pikachu from '../../img/pokemon/pikachu5.png'
import blastoise from '../../img/pokemon/blastoise2.png'
import mewtwo from '../../img/pokemon/mewtwo1.png'
import jiggly from '../../img/pokemon/jigglypuff3.png'

const Party = () => {

  return (

  <div id="party" className="full-screen">
    <h3>Your Party</h3>
    <div id="p1" className='poke-item'>
      <img src={charizard} alt="charizard"/> 
      <p>Charizard</p>
    </div>
    <div id="p2" className='poke-item'>
      <img src={machamp} alt="machamp"/> 
      <p>Machamp</p>
    </div>
    <div id="p3" className='poke-item'>
      <img src={pikachu} alt="pikachu"/> 
      <p>Pikachu</p>
    </div>
    <div id="p4" className='poke-item'>
      <img src={blastoise} alt="blastoise"/> 
      <p>Blastoise</p>
    </div>
    <div id="p5" className='poke-item'>
      <img src={mewtwo} alt="mewtwo"/> 
      <p>Mewtwo</p>
    </div>
    <div id="p6" className='poke-item'>
      <img src={jiggly} alt="jiggly"/> 
      <p>Jigglypuff</p>  
    </div>
    <Link to='/welcome' id="return" className='poke-item'>
      Home
    </Link>
  </div>
  
  );
}
 
export default Party;