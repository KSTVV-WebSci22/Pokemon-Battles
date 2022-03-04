import './Welcome.css'
import pikachu from './pikachu.png'
import pokeball from './pokeball.png'
import phone from './phone.png'
import fist from './fist.png'
import gym from '../../img/items/gym.png'
import Sound from 'react-sound'
import Music from '../../sounds/music/welcome.mp3'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (

  <div id="welcome" className="full-screen">
    <Sound 
      url={Music}
      playStatus={ isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
    />
    <h3>Welcome back Player!</h3>
    <Link to='/battle' id="find-match" className='menu-item'>
      <img src={pokeball} alt="pokeball"/> 
      <img src={pokeball} alt="pokeball"/> 
      Random Match
    </Link>
    <Link to='/party' id="partymenu" className='menu-item'>
      <img src={gym} alt="pikachu"/> 
      <img src={gym} alt="gym"/> 
      Party
    </Link>
    <Link to='/friends' id="friends-link" className='menu-item'>
      <img src={pikachu} alt="pikachu"/> 
      <img src={pikachu} alt="pikachu"/> 
      Friends
    </Link>
    <Link to='/players' id="top-players" className='menu-item'>
      <img src={fist} alt="fist"/> 
      <img src={fist} alt="fist"/> 
      Top Players
    </Link>
    <Link to='/shop' id="shop-link" className='menu-item'>
      <img src={shopImg} alt="shop"/> 
      <img src={shopImg} alt="shop"/> 
      Shop
    </Link>
    <div id="settings" className='menu-item'>
      <img src={phone} alt="phone"/> 
      <img src={phone} alt="phone"/> 
      Settings
    </div>
  </div>
  
  );
}
 
export default Welcome;