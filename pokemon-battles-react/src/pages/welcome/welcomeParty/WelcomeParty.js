import './WelcomeParty.css'
import { Row, Col } from 'react-bootstrap';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { useState, useEffect } from 'react'

const WelcomeParty = ({user}) => {

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
    if(type === 'fire'){
      setFire(fire => fire + 1)
      console.log(type)
    }
  }

  useEffect(() => {
    user.pokemon.slice(0,5).map(p => {
      typeCheck(p.type1.toLowerCase())
      typeCheck(p.type2.toLowerCase())
    })
  }, []);

  
  return ( <>
    <h4>My Party</h4>
    <Row className='mb-3' xs={1} md={2}>
      <Col className='myParty'>
        {user.pokemon.slice(0,5).map(p => {
          return (
            <div className='poke-bar'>
              <div className="level" 
                style={{backgroundColor: `var(--${p.type1.toLowerCase()})`}}>{p.current_level}</div>
              <div className="pokemon-name">{p.identifier}</div>
            </div>
          )
        })}
      </Col>
      <Col>
        <PolarArea options={options} data={data} />
      </Col>
    </Row>
  </> );
}
 
export default WelcomeParty;