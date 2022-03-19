import './party.css'
import charizard from '../../img/pokemon/charizard1.png'
import machamp from '../../img/pokemon/machamp.png'
import pikachu from '../../img/pokemon/pikachu5.png'
import blastoise from '../../img/pokemon/blastoise2.png'
import mewtwo from '../../img/pokemon/mewtwo1.png'
import jiggly from '../../img/pokemon/jigglypuff3.png'
import Back from '../../components/Back'

const Party = () => {

  return (
  <div className='content'>
    <Back name="Back" to="/welcome" />
    <div id="party" className='content-item'>
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
    </div>
  </div>
  );
}
 
export default Party;