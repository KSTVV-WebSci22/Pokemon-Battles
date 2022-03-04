import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Battle from './pages/battle/Battle';
import Welcome from './pages/welcome/Welcome';
import Players from './pages/players/players';
import Party from './pages/party/party';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/battle' element={<Battle/>} />
        <Route path='/welcome' element={<Welcome/>} />
        <Route path='/players' element={<Players/>} />
        <Route path='/party' element={<Party/>} />
      </Routes>
    </Router>
  );
}

export default App;
