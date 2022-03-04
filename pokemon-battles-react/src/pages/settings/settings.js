import { useState, useEffect, useRef, useContext } from 'react';
import './settings.css'
import { Card, Form} from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext';
import { Link } from 'react-router-dom';
import ball from '../../img/items/pokemonball.png';

const Settings = () => {
    const{ mute, setMute, volume, setVolume} = useContext(ClientContext);
   
    return (
<div id ="set" className='full-screen'>
 <Card className="card bg-transparent text-white mb-3" >
    <div className="top">
       <h1 className="title">SETTINGS</h1>   
    </div>
    <div className="card-body">
     <div className="divider">
     <p>Music</p>
        {mute?  
         <button 
            className="music" 
            id="music-on"
            onClick={() => {setMute(!mute)}}
         >On</button>
         :
         <button 
            className="music" 
            id="music-off"
            onClick={() => {setMute(!mute)}}
         >Off</button>
        }
      </div>
      <div class="divider">
         <p id="volume">Volume</p>
         <Form.Range 
            defaultValue={volume} 
            id="vol-slider" 
            min={0} 
            max={100} 
            onChange={(e)=>{setVolume(e.target.value)}} 
            tooltip='auto' 
         />
      </div>
      <div>
         <p>Update Username</p>
        <input type="text" id="password" maxlength="255" placeholder="Username"></input>
      </div>
      <div>
         <p>Change Password</p>
         <input type="text" id="username" maxlength="255" placeholder="Password"></input>
      </div>
     </div>
     <img id="ball" src={ball} alt="p-ball"/>
     <div class="card-footer">
        <Link to ='/' class="music" id="logout">LOGOUT</Link>
      </div>
  </Card>
</div>
     );
}
 
export default Settings;
