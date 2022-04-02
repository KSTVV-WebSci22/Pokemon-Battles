import React, { useState, useContext, useEffect, Suspense } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import pokemon from '../../img/items/Pokemon3.png';
import ash from '../../img/people/ashketchum.png';
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../context/ClientContext';
import Loading from '../../components/Loading';
import googleIcon from './google.png'

// Firebase
import { signInWithGoogle } from '../../util/users/Users';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../util/Firebase';

const Home = () => {
    let navigate = useNavigate();

    // Context
    const{ setSong, website } = useContext(ClientContext);

    // States
    const [login, setLogin] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    
    // Login System
    const loginCheck = async () => {
        const response = await signInWithGoogle();
        if (response){
            navigate("./welcome")
        } else {
            console.log(`Response: ${response}`)
        }
    }

    // Authorized
    onAuthStateChanged(auth, (user) => {
        if (user) {
            navigate('/welcome')
        }
    });

    useEffect(()=>{
        setSong(1)
    }, [])
    
    return ( 
        <div id="home" className='content content-center'>
            <div id="intro">
                <h3>Welcome to</h3>
                <img src={pokemon} alt="" />
                <h2 className='mb-5'>Battles</h2>
            </div>
            {login ? 
                <>
                    {/* Welcome Message */}
                    <h3 className='mt-3'>Welcome Trainer!</h3>

                    {/* Input Boxes */}
                    {/* <FloatingLabel
                        controlId="floatingInput"
                        label="Email address"
                        className="mb-3"
                    >
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="Password">
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel> */}

                    {/* Buttons */}
                    {/* <Link 
                        to='welcome'
                        className='sbutton fw-bold mb-3'
                    >Lets Go!</Link> */}

                    {/* Gmail Login */}
                    <button 
                        onClick={loginCheck} 
                        className='gicon fw-bold mb-3'
                    >
                        <img src={googleIcon} />Sign in with Google
                    </button>

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
                            className='sbutton fw-bold mb-3 w-100'
                            onClick={()=>{
                                setLogin(!login)
                            }} 
                        >Lets Go!</button><br/>
                        {/* <small className='mb-5'>
                            Don't have an account?  
                            <span 
                                id="login"
                                onClick={()=>{
                                    setCreateAccount(!createAccount)
                                }} 
                                
                            > Create an Account</span>
                        </small> */}
                    </div>
                    </>
                
            }
        </div>    
    );
}
 
export default Home;