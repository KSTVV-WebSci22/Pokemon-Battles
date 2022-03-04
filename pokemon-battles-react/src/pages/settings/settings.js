import { useState, useEffect, useRef, useContext } from 'react';
import './settings.css'
import { Card} from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext';
import RangeSlider from 'react-bootstrap-range-slider';
import { Link } from 'react-router-dom';

const Settings = () => {
    const{mute,setMute} = useContext(ClientContext);
   
    const [ value, setValue ] = useState(0);
    
  const onChange = (e) => {
    setValue(e.target.value);
  }
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
         <RangeSlider value={value} id="vol-slider" min={0} max={100} onChange={onChange} tooltip='auto' />
      </div>
      <div>
         <p>Update Username</p>
        <input type="text" id="password" maxlength="255" placeholder="Username"></input>
      </div>
      <div>
         <p>Change Passwod</p>
         <input type="text" id="username" maxlength="255" placeholder="Password"></input>
      </div>
     </div>
     <div class="card-footer">
        <Link to ='../../pages/home' class="music" id="logout">LOGOUT</Link>
      </div>
  </Card>
</div>
     );
}
 
export default Settings;