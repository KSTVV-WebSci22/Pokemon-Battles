import './WelcomeParty.css'
import { Row, Col, Modal, Button } from 'react-bootstrap';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { useState, useEffect, useContext } from 'react'
import { addPokemon } from '../../../util/users/Users';
import axios from 'axios';
import { ClientContext } from '../../../context/ClientContext';
import PokemonStats from '../../../components/PokemonStats';

const WelcomeParty = ({user}) => {
  const { website } = useContext(ClientContext);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

  // so many states

  const [bug, setBug] = useState(0)
  const [dark, setDark] = useState(0)
  const [dragon, setDragon] = useState(0)
  const [electric, setElectric] = useState(0)
  const [fairy, setFairy] = useState(0)
  const [fighting, setFighting] = useState(0)
  const [fire, setFire] = useState(0)
  const [flying, setFlying] = useState(0)
  const [ghost, setGhost] = useState(0)
  const [grass, setGrass] = useState(0)
  const [ground, setGround] = useState(0)
  const [ice, setIce] = useState(0)
  const [normal, setNormal] = useState(0)
  const [poison, setPoison] = useState(0)
  const [psychic, setPyschic] = useState(0)
  const [rock, setRock] = useState(0)
  const [steal, setSteal] = useState(0)
  const [water, setWater] = useState(0)

  const data = {
    labels: ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steal', 'water'],
    datasets: [
      {
        label: 'Pokemon Types',
        data: [bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steal, water],
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue(`--bug`),
          getComputedStyle(document.documentElement).getPropertyValue(`--dark`),
          getComputedStyle(document.documentElement).getPropertyValue(`--dragon`),
          getComputedStyle(document.documentElement).getPropertyValue(`--electric`),
          getComputedStyle(document.documentElement).getPropertyValue(`--fairy`),
          getComputedStyle(document.documentElement).getPropertyValue(`--fighting`),
          getComputedStyle(document.documentElement).getPropertyValue(`--fire`),
          getComputedStyle(document.documentElement).getPropertyValue(`--flying`),
          getComputedStyle(document.documentElement).getPropertyValue(`--ghost`),
          getComputedStyle(document.documentElement).getPropertyValue(`--grass`),
          getComputedStyle(document.documentElement).getPropertyValue(`--ground`),
          getComputedStyle(document.documentElement).getPropertyValue(`--ice`),
          getComputedStyle(document.documentElement).getPropertyValue(`--normal`),
          getComputedStyle(document.documentElement).getPropertyValue(`--poison`),
          getComputedStyle(document.documentElement).getPropertyValue(`--psychic`),
          getComputedStyle(document.documentElement).getPropertyValue(`--rock`),
          getComputedStyle(document.documentElement).getPropertyValue(`--steal`),
          getComputedStyle(document.documentElement).getPropertyValue(`--water`),
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
          display: false
      },
      tooltips: {
          callbacks: {
             label: function(tooltipItem) {
                    return tooltipItem.yLabel;
             }
          }
      }
    }
  }

  const typeCheck = (type) => {
    if(type === 'bug'){
      setBug(prev => prev + 1)
    } else if (type === 'dark'){
      setDark(prev => prev + 1)
    } else if (type === 'dragon'){
      setDragon(prev => prev + 1)
    } else if (type === 'electric'){
      setElectric(prev => prev + 1)
    } else if (type === 'fairy'){
      setFairy(prev => prev + 1)
    } else if (type === 'fighting'){
      setFighting(prev => prev + 1)
    } else if (type === 'fire'){
      setFire(prev => prev + 1)
    } else if (type === 'flying'){
      setFlying(prev => prev + 1)
    } else if (type === 'ghost'){
      setGhost(prev => prev + 1)
    } else if (type === 'grass'){
      setGrass(prev => prev + 1)
    } else if (type === 'ground'){
      setGround(prev => prev + 1)
    } else if (type === 'ice'){
      setIce(prev => prev + 1)
    } else if (type === 'normal'){
      setNormal(prev => prev + 1)
    } else if (type === 'poison'){
      setPoison(prev => prev + 1)
    } else if (type === 'psychic'){
      setPyschic(prev => prev + 1)
    } else if (type === 'rock'){
      setRock(prev => prev + 1)
    } else if (type === 'steal'){
      setSteal(prev => prev + 1)
    } else if (type === 'water'){
      setWater(prev => prev + 1)
    }
  }

  useEffect(() => {
    user.pokemon.slice(0,6).map(p => {
      typeCheck(p.type1.toLowerCase())
      typeCheck(p.type2.toLowerCase())
    })
  }, []);

  const testPokemonAdd = () => {
    const random = Math.floor(Math.random() * (151 - 1) + 1);
    console.log(random)
    axios.get(`${website}/api/newPokemon/${random}/5`)
    .then(response => {
      addPokemon(response.data)
      alert("Test Pokemon Added")
    })
    .catch( error => {
      console.log(error);
    })
  }

  
  return ( <>
    <h4 className='light-text'>My Party <button className='stats' onClick={handleShow}>Stats</button></h4>
    <Row className='mb-3'>
      <Col className='myParty' xs={12}>
        {user.pokemon.slice(0,6).map(p => {
          return (
            <PokemonStats poke={p} showMoves={false}/>
          )
        })}
      </Col>
      {/* <Col className="test-pokemon" xs={12}>
        <button onClick={()=>{
          testPokemonAdd()
        }}>Add Pokemon to Party. Delete Soon</button>
      </Col> */}
    </Row>

    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <h5>Move Types</h5>
        <PolarArea options={options} data={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </> );
}
 
export default WelcomeParty;