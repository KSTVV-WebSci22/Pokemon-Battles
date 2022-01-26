import React from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import pokemon from '../../img/items/Pokemon3.png';
import pokeball from '../../img/items/pokemonball.png';
import ash from '../../img/people/ashketchum.png';
import { Link } from 'react-router-dom';


const Home = () => {
    return ( 
        <div id="welcome">
            <div id="intro">
                <h3>Welcome to</h3>
                <img src={pokemon} alt="" />
                <h2>Battles</h2>
            </div>
            <img src={ash} alt="pokeball animation" className='m-auto'/>
            <div id="login-button">
                <Link to='./create'>
                    <button onClick={'./create'}>Create Account</button><br/>
                </Link>
                <small>Already have an account? <Link to='./login' id="login">Login</Link></small>
            </div>
        </div>    
    );
}
 
export default Home;