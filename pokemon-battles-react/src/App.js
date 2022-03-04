import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Battle from './pages/battle/Battle';
import Welcome from './pages/welcome/Welcome';
import Friends from './pages/friends/friends';
import Settings from './pages/settings/settings';
import{ClientContext } from './context/ClientContext';
import { useState } from 'react';

function App() {
  const [mute, setMute] = useState(true);
  return (
    <ClientContext.Provider
      value={{
        mute,setMute
      }}
    >
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/battle' element={<Battle/>} />
        <Route path='/welcome' element={<Welcome/>} />
        <Route path='/friends' element={<Friends/>} />
        <Route path='/friends' element={<Friends/>} />
        <Route path='/settings' element={<Settings/>} />
      </Routes>
    </Router>
    </ClientContext.Provider>
  );
}

export default App;
