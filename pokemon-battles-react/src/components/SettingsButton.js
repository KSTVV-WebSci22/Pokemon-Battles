import './SettingsButton.css'
import Phone from './phone.png'
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react'
import { ClientContext } from '../context/ClientContext';
import { Form } from 'react-bootstrap';

const SettingsButton = () => {

    // Context 
    const{ soundEffects, setSoundEffects, volume, setVolume, disclaimer} = useContext(ClientContext);

    // States
    const [show, setShow] = useState(false);

    return (<>
        {!show ? 
            <>
                {/* Make sure disclaimer is pressed before entering */}
                {!disclaimer && <div 
                    id="settings-button"
                    onClick={()=>{setShow(true)}}
                >
                    <img src={Phone} alt="settings icon" />
                </div> }
            </>
            :
            <div id="settings-menu" className='content content-center'>
                {/* Music */}
                <div className="settings-container">
                    <h3>Music</h3>

                    {/* On / Off button */}
                    <button 
                        className={volume === 0 ? "music music-off" : "music music-on" }
                        onClick={() => {
                            volume === 0 ? setVolume(50) : setVolume(0)
                            volume === 0 ? localStorage.setItem("volume", 50) : localStorage.setItem("volume", 0)
                        }}
                    >{volume === 0 ? "Off" : "On"}</button>

                    {/* Music Volume */}
                    <Form.Range 
                        defaultValue={localStorage.getItem("volume")} 
                        className="mt-4"
                        value={volume}
                        id="vol-slider" 
                        min={0} 
                        max={100} 
                        onChange={(e)=>{
                            localStorage.setItem("volume", e.target.value);
                            setVolume(e.target.value)
                        }} 
                        tooltip='auto' 
                    />
                </div>
                <div className="settings-container">
                    {/* Sound Effects */}
                    <h3>Sound Effects</h3>

                    {/* On / Off button */}
                    <button 
                        className={soundEffects === 0 ? "music music-off" : "music music-on" }
                        onClick={() => {
                            soundEffects === 0 ? setSoundEffects(50) : setSoundEffects(0)
                            soundEffects === 0 ? localStorage.setItem("soundEffects", 50) : localStorage.setItem("soundEffects", 0)
                        }}
                    >{soundEffects === 0 ? "Off" : "On"}</button>

                    {/* soundEffects Volume */}
                    <Form.Range 
                        defaultValue={localStorage.getItem("soundEffects")} 
                        className="mt-4"
                        value={soundEffects}
                        id="vol-slider" 
                        min={0} 
                        max={100} 
                        onChange={(e)=>{
                            localStorage.setItem("soundEffects", e.target.value);
                            setSoundEffects(e.target.value)
                        }} 
                        tooltip='auto' 
                    />
                </div>
                {/* Cancel Button */}
                <button className='sbutton mt-5' onClick={()=>{setShow(false)}}>
                    Close
                </button>
            
            </div>
        }
    </>);
}
 
export default SettingsButton;