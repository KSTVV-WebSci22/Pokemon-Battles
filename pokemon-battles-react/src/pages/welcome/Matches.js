import './Matches.css'
import { getUser } from '../../util/users/Users'
import { auth } from '../../util/Firebase'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Matches = ({user}) => {
  const navigate = useNavigate()
  return ( 
    <div id="matches">
      <h4>Score</h4>
      <Row className='mb-3'>
        <Col>Wins: {user.win}</Col>
        <Col>Losses: {user.loss}</Col>
      </Row>


      <h4>Matches</h4>
      <Row className='mb-3'>
        <Col>
          <button 
            onClick={()=>{
              navigate('/battle')
            }}
            className='find-match'>Find Match</button>
        </Col>
      </Row>
      <Row>
        <Col>

        </Col>
      </Row>

    </div>
  );
}
 
export default Matches;