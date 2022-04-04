import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Firebase
import { getUser } from '../util/users/Users'
import { auth } from '../util/Firebase'

const Navbar = () => {

  let navigate = useNavigate()
  const [user, setUser] = useState()

  const userInfo = async (uid) => {
    const info = await getUser(uid)
    setUser(info)
    // return info
  }

  useEffect(() => {
    if(auth.currentUser){
      userInfo(auth.currentUser.uid)
    } else {
      navigate('/')
    }
  }, []);

  return ( 
    
    <div id="navbar">
      {user ? <> 
      <Link to='/profile'>
        <img className='profile-pic' src={user.profilePic} alt="profile" />
      </Link>
      <div className='brand'>
        <h1>{user.username}</h1>
        <small>Status: <span className='navbar-status online'>Online</span></small>
      </div>
      <div id="navbar-wallet" className='ms-auto'>
        <Link to='/party'
            className='navbar-pokemon'
        >
          {user.pokemon[0] && <>
            <img className="" src={require("../img/pokemon/" + user.pokemon[0].identifier + ".png")} alt={"my pokemon"} />
            <span className='navbar-level'>{user.pokemon[0].current_level}</span>
          </>} 
        </Link>

        <h5>🪙 {user.wallet}</h5>
      </div>
      </>
      :<></>}
    </div>
  );
}
 
export default Navbar;