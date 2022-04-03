import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = ({user}) => {
  return ( 
    <div id="navbar">
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
          <img className="" src={require("../img/pokemon/" + user.pokemon[0].identifier + ".png")} alt={"my pokemon"} />
          <span className='navbar-level'>{user.pokemon[0].current_level}</span>
        </Link>

        <h5>🪙 {user.wallet}</h5>
      </div>
    </div>
  );
}
 
export default Navbar;