import React, { useState, useContext, useEffect, Suspense } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import pokemon from '../../img/items/Pokemon3.png';
import ash from '../../img/people/ashketchum.png';
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../context/ClientContext';
// import Loading from '../../components/Loading';
import googleIcon from './google.png'

// Firebase
import { signInWithGoogle } from '../../util/users/Users';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, rdb } from '../../util/Firebase';
import { set, ref } from 'firebase/database';

const Home = () => {
    let navigate = useNavigate();

    // Context
    const{ setSong, loading, setLoading } = useContext(ClientContext);

    // States
    const [login, setLogin] = useState(false);
    
    // Login System
    const loginCheck = async () => {
        const response = await signInWithGoogle();
        if (response){
            navigate("./welcome")
            const userStatusDatabaseRef = ref(rdb, 'status/' + auth.currentUser.uid + '/state');
            set(userStatusDatabaseRef, "online");
        } else {
            console.log(`Response: ${response}`)
        }
    }

    useEffect(()=>{
        setSong(1)
        if(auth.currentUser){
            navigate('./welcome')
        }

        setLoading(false)
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

                    {/* Gmail Login */}
                    <button 
                        onClick={()=>{loginCheck()}} 
                        className='gicon fw-bold mb-3'
                    >
                        <img src={googleIcon} alt="google logo" />Sign in with Google
                    </button>

                    <span 
                        className='fw-bold'
                        onClick={()=>{setLogin(!login)}}
                    >Cancel</span>
                </>
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
                </div>
                </>
            }
        </div>    
    );
}
 
export default Home;