import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Battle from './pages/battle/Battle';
import Welcome from './pages/welcome/Welcome';
import Players from './pages/players/players';
import Party from './pages/party/party';
import Friends from './pages/friends/Friends';
import Shop from './pages/shop/Shop';
import Settings from './pages/settings/settings'
import { ClientContext } from './context/ClientContext';
import { useState, useEffect } from 'react';
import SoundManager from './components/SoundManager';
import SettingsButton from './components/SettingsButton';
import Profile from './components/Profile';

function App() {

  const [mute, setMute] = useState(false)  
  const [volume, setVolume] = useState(localStorage.getItem("volume"));
  const [song, setSong] = useState(1);
  const [disclaimer, setDisclaimer] = useState(true);

  useEffect(()=>{
    if (localStorage.getItem("volume") === null) {
      localStorage.setItem("volume", 50);
      setVolume(50);
    } else {
      console.log("Volume Already Set: " + volume)
    }
  }, [])
  


  return (
    <ClientContext.Provider value={{
      mute, setMute,
      volume, setVolume,
      song, setSong,
      // settings, setSettings,
      disclaimer, setDisclaimer
    }}>

    {/* Sound Manager */}
    <SoundManager song={song}/>

    <div className='full-screen'>
      { disclaimer ?
        <>
          {/* Disclaimer notice must be selected each time on refresh */}
          <div className="content">
            <div id="disclaimer">
                <h3>Disclaimer</h3>
                All content in this game is property of Pokemon and the Nintendo Corporation.  This game is intended as satire and is does not attempt to take profits in any way.  All rights reserved to pokemon.  Please don't sue me bro.
                <button 
                    className='sbutton'
                    onClick={()=>{
                        setMute(true)
                        setDisclaimer(false)
                    }}
                >I Understand</button>  
            </div>
          </div>
        </>
        :
        <>
          {/* Routes */}
          <Router>
            <SettingsButton />
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/battle' element={<Battle/>} />
              <Route path='/welcome' element={<Welcome/>} />
              <Route path='/players' element={<Players/>} />
              <Route path='/party' element={<Party/>} />
              <Route path='/friends' element={<Friends/>} />
              <Route path='/shop' element={<Shop/>} />
              <Route path='/settings' element={<Settings/>} />
            </Routes>
          </Router>
        </>
      }
    </div>
    </ClientContext.Provider>
    
  );
}

export default App;