import './Welcome.css'
import prof from '../../img/people/prof.png'
import { useNavigate } from 'react-router-dom'
import { useEffect, useContext, useState } from 'react'
import { ClientContext } from '../../context/ClientContext'
import MainMenu from './MainMenu'
import Typewriter from "typewriter-effect";

// Firebase
import { auth } from '../../util/Firebase'
import { updateUser, getUser, addPokemon } from '../../util/users/Users'
import axios from 'axios'
import { onAuthStateChanged  } from "firebase/auth";


const Welcome = () => {
  let navigate = useNavigate();

  // States
  const [name, setName] = useState("")
  const [newUser, setNewUser] = useState(true)
  const [stage, setStage] = useState(0)
  // const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null);
  
  // First Pokemon
  const [first, setFirst] = useState()
  const [firstQ, setFirstQ] = useState(null)

  // Context
  const{ setSong, website, setLoading } = useContext(ClientContext);

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
            <div className="mb-auto" id="new-user-title">
              <h1 className='mt-1'>Welcome to the exciting world of Pokemon!</h1>
              <p id="prof-oak-1">
                <Typewriter
                  onInit={(typewriter)=> {

                  typewriter
                  .pauseFor(2000)
                  .changeDelay(75)
                  .typeString("Hello!")
                  .pauseFor(1000)
                  .typeString(" My name is Prof. Oak and i'm here to help you become the #1 Pokemon Trainer!")
                  .pauseFor(1000)
                  .typeString(`<br/><br/>To start we first need to get you a pokemon!  Are you ready to meet your new best friend?`)
                  .start();
                  }}
                  />
              </p>
              
              <img className="prof" src={prof} alt="professor" />
              <h3 className='yellow-text'>Oh I forgot to ask! <br/>What should we call you?</h3>
            </div>
            <input 
              type="text" 
              onChange={(e)=>{
                setName(e.target.value)
              }}
            /> <br/>
            {name.length < 6 ? 
              <small>*must be 6 characters or more.</small>
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