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
import Loading from '../../components/Loading'

// Firebase
import { auth } from '../../util/Firebase'
import { updateUser, getUser } from '../../util/users/Users'
import axios from 'axios'

const Welcome = () => {
  let navigate = useNavigate();

  // States
  const [name, setName] = useState("")
  const [newUser, setNewUser] = useState(true)
  const [stage, setStage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [profilePic, setProfilePic] = useState()
  
  // First Pokemon
  const [first, setFirst] = useState()
  const [firstQ, setFirstQ] = useState(null)


  // Context
  const{ setSong, website } = useContext(ClientContext);

  const userInfo = async (uid) => {
    // Get User Info
    const user = await getUser(uid);

    // Check Username
    if(user.username == null){
      setStage(0)
      setNewUser(true);
      setLoading(false);

    // Check Pokemon
    } else if(user.pokemon == null){
      setStage(1)
      setNewUser(true)
      setLoading(false)

    // Good to go
    } else {
      setStage(1)
      setNewUser(false)
      setName(user.username)
      setProfilePic(user.profilePic)
      setLoading(false)
    }
  }

  useEffect(()=>{
    setSong(2)
    if(auth.currentUser){
      userInfo(auth.currentUser.uid)
      firstPokemon()
    } else {
      navigate('/')
    }
  }, [])

  const updateUsername = async () => {
    const updated = await updateUser(name)
    console.log("User Update: " + updated)
  }

  const firstPokemon = () =>{
    let array = []
    axios.get(`${website}/api/pokemon/1`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

    axios.get(`${website}/api/pokemon/4`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

    axios.get(`${website}/api/pokemon/7`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

      setFirst(array)
  }

  
  return (
  <div className='content'>
    {loading && <Loading />}
    <div id="welcome" className='content-item'>
      {newUser ? <>

        {/* Nickname */}
        { stage === 0 ? 
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
            {name.length <= 6 ? 
              <></>
              :
              <button 
                onClick={updateUsername}
                className='sbutton'>Submit
              </button>
            }
          </div> : <></>
        }

        {/* Base Pokemon Selection */}
        { stage === 1 ? 
          <div id="new-user">
            <h1 className='mb-5'>Lets get your next pokemon!</h1>
            {
              firstQ === null ? <>
                <p>Please choose your first pokemon!</p>
                <div className="first-pokemon-box">
                  {first && first.map((pokemon, key) => {
                    return (
                      <img 
                        key={key} 
                        src={require("../../img/pokemon/" + pokemon.identifier + ".png")} 
                        alt={pokemon.identifier} 
                        onClick={()=>{setFirstQ(first[key])}}
                      />
                    )
                  })}
                </div>
                <h3>Which Pokemon?</h3>
                
              </>
              :
              <>
                
                <h3>{firstQ.identifier}</h3>
                <img src={require("../../img/pokemon/" + firstQ.identifier + ".png")} alt={"first pokemon"} /><br/>
                <p>{firstQ.type1}{firstQ.type2 === "None" ? "" : firstQ.type2}</p>
                <h4>Are you sure?</h4>
                <button 
                  className='sbutton'
                  onClick={()=>{setStage(2)}}
                >Yes</button>
                <button 
                  className='ms-3'
                  variant="danger"
                  onClick={()=>{setStage(2)}}
                >No</button>
              </>
            }
          </div> : <></>
        }

        {/* Remaining 5 pokemon */}
        </>
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