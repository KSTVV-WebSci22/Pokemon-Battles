import './Welcome.css'
import pikachu from './pikachu.png'
import pokeball from './pokeball.png'
import fist from './fist.png'
import gym from '../../img/items/gym.png'
import shopImg from './shop.png'
import prof from '../../img/people/prof.png'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import { ClientContext } from '../../context/ClientContext'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db, getUser, updateUser } from '../../util/Firebase'
import Loading from '../../components/Loading'
import { onSnapshot, doc } from 'firebase/firestore'


const Welcome = () => {
  let navigate = useNavigate();

  // States
  const [name, setName] = useState("")
  const [newUser, setNewUser] = useState(true)
  const [loading, setLoading] = useState(true)
  const [uid, setUID] = useState('')
  const [profilePic, setProfilePic] = useState()

  // Context
  const{ setSong } = useContext(ClientContext);

  const userInfo = async (uid) => {
    const user = await getUser(uid);
    if(user.username == null){
      setNewUser(true);
      setLoading(false);
    } else {
      console.log(user.profilePic)
      setName(user.username)
      setProfilePic(user.profilePic)
      setLoading(false)
    }
  }

  useEffect(()=>{
    setSong(2)
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is Signed In
        console.log(user);
        setUID(user.uid);
        listenToUsername(user.uid)
        userInfo(user.uid);
      } else {
        // User is signed out
        navigate('/');
      }
    })
  }, [])

  const updateUsername = async () => {
    const updated = await updateUser(uid, name)
    console.log(updated)
  }

  const listenToUsername = (uid) => {
    const user = doc(db, 'users/', uid)
    onSnapshot(user, docSnapshot => {
      if(docSnapshot.exists()) {
        console.log("listening to username")
        const docData = docSnapshot.data();
        if(docData.username != null) {
          console.log("listening to username2")
          setNewUser(false)
        } 
      }
    })
  }
  
  return (
  <div className='content'>
    {loading && <Loading />}
    <div id="welcome" className='content-item'>
      {newUser ?
        <div id="new-user">
          <h1 className='mb-5'>Welcome to the exciting world of Pokemon!</h1>
          <p>My name is Prof. Oak and i'm here to help you become the #1 Pokemon Trainer! 
             <br/>Let's not take too much time! Are you ready?! </p>
          <img src={prof} alt="professor" />
          <h3>Oh I forgot to ask! <br/>What should we call you?</h3>
          <input 
            type="text" 
            onChange={(e)=>{
              setName(e.target.value)
            }}
          /> <br/>
          {name === '' ? 
            <></>
            :
            <button 
              onClick={updateUsername}
              className='sbutton'>Submit
            </button>}
        </div>
        :
        <>
        <h3>Welcome Back, {name}!</h3>
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
          <img src={profilePic} alt="profile"/> 
          <img src={profilePic} alt="profile"/> 
          Profile
        </Link>
        </>
      }
    </div>
  </div>
  
  );
}
 
export default Welcome;