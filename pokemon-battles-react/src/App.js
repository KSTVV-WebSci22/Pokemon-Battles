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
import { useState } from 'react';
import SoundManager from './components/SoundManager';

function App() {

  const [mute, setMute] = useState(false)  
  const [volume, setVolume] = useState(100);
  const [song, setSong] = useState(1);

  return (
    <ClientContext.Provider value={{
      mute, setMute,
      volume, setVolume,
      song, setSong
    }}
    >

    {/* Sound Manager */}
    <SoundManager song={song}/>

    {/* Routes */}
    <Router>
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
    </ClientContext.Provider>
  );
}

export default App;