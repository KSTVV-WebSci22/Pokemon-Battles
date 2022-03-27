import './Profile.css'
import Back from '../../components/Back';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../util/Firebase';
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../context/ClientContext';

const Profile = () => {
    let navigate = useNavigate;
    const [uid, setUID] = useState("")
    const [email, setEmail] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [name, setName] = useState("")

    // Context
    const{ setSong } = useContext(ClientContext);


    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is Signed In
          console.log(user)
          setUID(user.uid)
          setEmail(user.email)
          setProfilePic(user.photoURL)
          setName(user.displayName)
        } else {
          // User is signed out
          navigate('/');
        }
      })

    useEffect(() => {
        setSong(2)
    }, []);

    return ( 
        <div className="content">
            <Back name={'Back'} to={"/welcome"} />
            <div id="profile" className="content-item">

                {/* Profile Pic */}
                <img src={`${profilePic}`} alt="Profile Picture" />

                {/* Username */}
                <h4 className='mt-3'>Username:</h4>
                <h5>{uid}</h5>

                {/* Email */}
                <h4 className='mt-3'>Email:</h4>
                <h5>{email}</h5>

                {/* Name */}
                <h4 className='mt-3'>Name:</h4>
                <h5>{name}</h5>


                <button className="sbutton">Logout</button>
            </div>
        </div>
    );
}
 
export default Profile;