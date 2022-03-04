import './App.css';
import './Variables.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';
import Battle from './pages/battle/Battle';
import Welcome from './pages/welcome/Welcome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/battle' element={<Battle/>} />
        <Route path='/welcome' element={<Welcome/>} />
      </Routes>
    </Router>
  );
}

export default App;
