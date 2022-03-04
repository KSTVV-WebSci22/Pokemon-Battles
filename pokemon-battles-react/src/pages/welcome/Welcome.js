import './Welcome.css'
import pikachu from './pikachu.png'
import pokeball from './pokeball.png'
import phone from './phone.png'
import fist from './fist.png'
import Sound from 'react-sound'
import Music from '../../sounds/music/welcome.mp3'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { ClientContext } from '../../context/ClientContext'

const Welcome = () => {
  const{mute,setMute} = useContext(ClientContext);
  return (

  <div id="welcome" className="full-screen">
    <Sound 
      url={Music}
      playStatus={ mute ? Sound.status.PLAYING : Sound.status.STOPPED}
    />
    <h3>Welcome back Player!</h3>
    <Link to='/battle' id="find-match" className='menu-item'>
      <img src={pokeball} alt="pokeball"/> 
      <img src={pokeball} alt="pokeball"/> 
      Random Match
    </Link>
    <Link to='/friends' id="friends-link" className='menu-item'>
      <img src={pikachu} alt="pikachu"/> 
      <img src={pikachu} alt="pikachu"/> 
      Friends
    </Link>
    <div id="top-players" className='menu-item'>
      <img src={fist} alt="phone"/> 
      <img src={fist} alt="phone"/> 
      Top Players
    </div>
    <Link to='/settings' id="settings" className='menu-item'>
      <img src={phone} alt="phone"/> 
      <img src={phone} alt="phone"/> 
      Settings
    </Link>
  </div>
  
  );
}
 
export default Welcome;