import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Battle from './pages/battle/Battle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/battle' element={<Battle/>} />
      </Routes>
    </Router>
  );
}

export default App;
