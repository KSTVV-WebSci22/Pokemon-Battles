import './Profile.css'
import { Link } from 'react-router-dom';

const Profile = () => {
    return ( 
      <button id="profile">
          <Link to={'/profile'}>
            <img src={localStorage.getItem('profilePic')} />
          </Link>
      </button>  
    );
}
 
export default Profile;