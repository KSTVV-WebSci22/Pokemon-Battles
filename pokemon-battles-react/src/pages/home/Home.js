import React, { useState } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import pokemon from '../../img/items/Pokemon3.png';
import ash from '../../img/people/ashketchum.png';
import { Link } from 'react-router-dom';
import TitleScreen from '../../sounds/music/titleScreen.mp3'
import Sound from 'react-sound'
import { FloatingLabel, Form} from 'react-bootstrap'

const Home = () => {

    const [disclaimer, setDisclaimer] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [login, setLogin] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    
    return ( 
        <div id="home" className='full-screen'>
            <Sound 
                url={TitleScreen}
                playStatus={ isPlaying ? Sound.status.PLAYING : Sound.status.STOPPED}
                // onPlaying={handleSongPlaying}
            />
            { disclaimer ?
            <>
                <div id="disclaimer">
                    <h3>Disclaimer</h3>
                    All content in this game is property of Pokemon and the Nintendo Corporation.  This game is intended as satire and is does not attempt to take profits in any way.  All rights reserved to pokemon.  Please don't sue me bro.
                    <button 
                        className='sbutton'
                        onClick={()=>{
                            setIsPlaying(!isPlaying)
                            setDisclaimer(false)
                        }}
                    >I Understand</button>  
                </div>
            </>
            :
            <>
                <div id="intro">
                    <h3>Welcome to</h3>
                    <img src={pokemon} alt="" />
                    <h2 className='mb-5'>Battles</h2>
                </div>
                {login ? 
                    <>
                        {/* Welcome Message */}
                        <h3 className='mt-3'>Welcome Back Trainer!</h3>

                        {/* Input Boxes */}
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            className="mb-3"
                        >
                            <Form.Control type="email" placeholder="name@example.com" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" />
                        </FloatingLabel>

                        {/* Buttons */}
                        <Link 
                            to='welcome'
                            className='sbutton fw-bold mb-3'
                        >Lets Go!</Link>
                        <span 
                            className='fw-bold'
                            onClick={()=>{setLogin(!login)}}
                        >Cancel</span>
                    </>
                    : 
                    createAccount ?
                        <></>
                        :
                        <>
                        <img src={ash} alt="pokeball animation" className='mb-3'/>
                        <div id="login-button">
                            <button 
                                className='sbutton fw-bold mb-3 w-50'
                                onClick={()=>{
                                    setLogin(!login)
                                }} 
                            >Login!</button><br/>
                            <small className='mb-5'>
                                Don't have an account?  
                                <span 
                                    id="login"
                                    onClick={()=>{
                                        setCreateAccount(!createAccount)
                                    }} 
                                    
                                > Create an Account</span>
                            </small>
                        </div>
                        </>
                    
                }
            </>
            }
        </div>    
    );
}
 
export default Home;