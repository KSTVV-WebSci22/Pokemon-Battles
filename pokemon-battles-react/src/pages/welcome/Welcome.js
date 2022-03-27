import './Welcome.css'
import pikachu from './pikachu.png'
import pokeball from './pokeball.png'
import fist from './fist.png'
import gym from '../../img/items/gym.png'
import shopImg from './shop.png'
import { Link } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { ClientContext } from '../../context/ClientContext'
import Profile from '../../components/Profile'

const Welcome = () => {
  const{ setSong } = useContext(ClientContext);

  useEffect(()=>{
    setSong(2)
  }, [])
  
  return (
  <div className='content'>
    <div id="welcome" className='content-item'>
      <h3>Welcome back {localStorage.getItem("name")}!</h3>
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
      <Link to='/profile' id="profile-link" className='menu-item'>
        <img src={localStorage.getItem("profilePic")} alt="profile"/> 
        <img src={localStorage.getItem("profilePic")} alt="profile"/> 
        Profile
      </Link>
    </div>
  </div>
  
  );
}
 
export default Welcome;