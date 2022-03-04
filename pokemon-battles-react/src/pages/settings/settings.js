import { useState, useEffect, useRef, useContext } from 'react';
import './settings.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import { FloatingLabel, Form, Card} from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext';


const Settings = () => {
    const{mute,setMute} = useContext(ClientContext);
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
    </div>
  </Card>
</div>
     );
}
 
export default Settings;