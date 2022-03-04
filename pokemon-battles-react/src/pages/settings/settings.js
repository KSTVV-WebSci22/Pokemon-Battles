import { useState, useEffect, useRef, useContext } from 'react';
import './settings.css'
import { Card} from 'react-bootstrap'
import { ClientContext } from '../../context/ClientContext';
import RangeSlider from 'react-bootstrap-range-slider';

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
     </div>
     <div class="card-footer">
        <button class="music" id="logout">Log Out</button>
      </div>
  </Card>
</div>
     );
}
 
export default Settings;