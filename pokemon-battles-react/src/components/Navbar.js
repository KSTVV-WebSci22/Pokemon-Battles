import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import coin from '../img/items/coin.png'
import backpack from '../img/items/backpack.png'
// Firebase

import { getUser, getUserStatus } from '../util/users/Users'
import { auth } from '../util/Firebase'
import { ClientContext } from '../context/ClientContext'
const Navbar = () => {

  const {user, setUser} = useContext(ClientContext)

  let navigate = useNavigate()
  const userInfo = async (uid) => {
    const info = await getUser(uid)
    setUser(info)
    // return info
  }


  useEffect(() => {
    if(auth.currentUser){
      getUserStatus(auth.currentUser.uid);
      userInfo(auth.currentUser.uid);
    } else {
      navigate('/')
    }
  }, []);

  return ( 
    <div id="navbar">
      { user?
       <> 
      <div id="navbar-content">
        <Link to='/profile'>
          <img className='profile-pic' referrerPolicy="no-referrer" src={user.profilePic} alt="profile" />
        </Link>
        <div className='brand'>
          <h1>{user.username}</h1>
          <small>Status: <span className='navbar-status online'>Online</span></small>
        </div>

        
        <div id="navbar-party" className='ms-auto'>
          <OverlayTrigger
            key='navbar-pokemon-tooltip'
            placement='left'
            overlay={
              <Tooltip id={`navbar-pokemon-tooltip`}>
                Party
              </Tooltip>
            }
          >
          <Link to='/party'
              className='navbar-pokemon'
          >
            {user.pokemon[0] && <>
              <img className="" src={require("../img/pokemon/" + user.pokemon[0].identifier + ".png")} alt={"my pokemon"} />
              <span className='navbar-level'>{user.pokemon[0].current_level}</span>
            </>} 
          </Link>
          </OverlayTrigger>
        </div>

      </div>
      <div id="navbar-links" className='mt-2'>
        <Link className="me-3" to={'/welcome'}>Home</Link>
        <Link className="me-3" to={'/friends'}>Friends</Link>
        <Link className="me-auto" to={'/shop'}>Shop</Link>

        <OverlayTrigger
          key='navbar-backpack'
          placement='bottom'
          overlay={
            <Tooltip id={`navbar-backpack`}>
              Backpack
            </Tooltip>
          }
        >
          <Link className='navbar-wallet' to={'/backpack'}>
          <span className='navbar-backpack me-1'><img src={backpack} />0</span> 
          <span className='navbar-coin'><img src={coin} /></span>{user.wallet}
          </Link>
        </OverlayTrigger>
      </div>
      
      </>
      :<></>}
    </div>
  );
}
 
export default Navbar;