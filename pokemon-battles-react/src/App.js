import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Battle from './pages/battle/Battle';
import Welcome from './pages/welcome/Welcome';
import Friends from './pages/friends/friends';
import Shop from './pages/shop/Shop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/battle' element={<Battle/>} />
        <Route path='/welcome' element={<Welcome/>} />
        <Route path='/friends' element={<Friends/>} />
        <Route path='/shop' element={<Shop/>} />
      </Routes>
    </Router>
  );
}

export default App;
