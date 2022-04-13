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
import MainMenu from './MainMenu'

// Firebase
import { auth, db, rdb } from '../../util/Firebase'
import { updateUser, getUser, addPokemon, getUserStatus } from '../../util/users/Users'
import axios from 'axios'
import { doc, getDoc, updateDoc, setDoc,   } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged  } from "firebase/auth";
import { ref, onValue, push, onDisconnect, set, serverTimestamp } from "firebase/database";


const Welcome = () => {
  let navigate = useNavigate();

  // States
  const [name, setName] = useState("")
  const [newUser, setNewUser] = useState(true)
  const [stage, setStage] = useState(0)
  // const [loading, setLoading] = useState(true)
  const [profilePic, setProfilePic] = useState()
  const [user, setUser] = useState(null);
  
  // First Pokemon
  const [first, setFirst] = useState()
  const [firstQ, setFirstQ] = useState(null)

  // Context
  const{ setSong, website, loading, setLoading } = useContext(ClientContext);

  // Authorized
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate('/')
    }
  });

  // User Info
  const userInfo = async () => {
    setLoading(true)
    // Get User Info
    const info = await getUser(auth.currentUser.uid);
    // Check Username
    if(info.username == null){
      setStage(0)
      setNewUser(true);
      setLoading(false);

    // Check Pokemon
    } else if(info.pokemon.length === 0){
      setStage(1)
      setNewUser(true)
      setLoading(false)

    // Good to go
    } else {
      setNewUser(false)
      setUser(info);
      setLoading(false)
    }
  }

  useEffect(()=>{
    getUserStatus(auth.currentUser.uid);
    setSong(2)
    if(auth.currentUser){
      userInfo()
      firstPokemon()
    } else {
      navigate('/')
    }
  }, [])

  

  const updateUsername = () => {
    updateUser(name)
    userInfo()
  }

  const firstPokemon = () =>{
    let array = []
    axios.get(`${website}/api/newPokemon/1/5`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

    axios.get(`${website}/api/newPokemon/4/5`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

    axios.get(`${website}/api/newPokemon/7/5`)
      .then(response => {
        array.push(response.data)
      })
      .catch( error => {
        console.log(error);
      })

      setFirst(array)
  }

  const newPokemon = async (pokemon) => {
    let ready = await addPokemon(pokemon);
    console.log(ready)
    userInfo()
  }
  
  return (
  <div className='content'>
    <div id="welcome" className='content-item'>
      {newUser ? <>

        {/* Nickname */}
        { stage === 0 ? 
          <div id="new-user">
            <h1 className='mb-5'>Welcome to the exciting world of Pokemon!</h1>
            <p>My name is Prof. Oak and i'm here to help you become the #1 Pokemon Trainer! 
              <br/>Let's not take too much time! Are you ready?! </p>
            <img className="prof" src={prof} alt="professor" />
            <h3 className='yellow-text'>Oh I forgot to ask! <br/>What should we call you?</h3>
            <input 
              type="text" 
              onChange={(e)=>{
                setName(e.target.value)
              }}
            /> <br/>
            {name.length < 6 ? 
              <></>
              :
              <button 
                onClick={()=>{
                  updateUsername()
                }}
                className='sbutton'>Submit
              </button>
            }
          </div> : <></>
        }

        {/* Base Pokemon Selection */}
        { stage === 1 ? 
          <div id="new-user">
            <h1 className='mb-3'>Please Choose your First Pokemon!</h1>
            {
              firstQ === null ? <>
                <div className="first-pokemon-box">
                  {first && first.map((pokemon, key) => {
                    return (
                      <img 
                        key={key} 
                        src={require("../../img/pokemon/" + pokemon.identifier + ".png")} 
                        alt={pokemon.identifier} 
                        className="first-pokemon-unselected"
                        onClick={()=>{setFirstQ(first[key])}}
                      />
                    )
                  })}
                </div>
                <h3>Which Pokemon?</h3>
                
              </>
              :
              <>
                {/* Selected First Pokemon Screen */}
                <h3>{firstQ.identifier}</h3>
                <img className="first-pokemon-selected" src={require("../../img/pokemon/" + firstQ.identifier + ".png")} alt={"first pokemon"} /><br/>
                <div className='mb-4'>
                  <h5 className='mb-3 yellow-text'>Pokemon Type:</h5>
                  <span className="pokemon-type" style={{backgroundColor: `var(--${firstQ.type1.toLowerCase()})`}}>{firstQ.type1}</span>
                  {firstQ.type2 !== "None" &&
                    <span className="pokemon-type" style={{backgroundColor: `var(--${firstQ.type2.toLowerCase()})`}}>{firstQ.type2}</span>
                  }
                </div>
                <h4>Are you sure?</h4>
                <div>
                  <button 
                    className='sbutton'
                    onClick={()=>{
                      newPokemon(firstQ)
                    }}
                  >Yes</button>
                  <button 
                    className='ms-3 sbutton-cancel'
                    onClick={()=>{setFirstQ(null)}}
                  >No</button>
                </div>
              </>
            }
          </div> : <></>
        }

        </>
        :
        <>
          <MainMenu />
        </>
      }
    </div>
  </div>
  
  );
}
 
export default Welcome;