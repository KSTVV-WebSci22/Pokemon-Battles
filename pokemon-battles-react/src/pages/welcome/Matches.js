import './Matches.css'
import { getUser } from '../../util/users/Users'
import { auth } from '../../util/Firebase'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Score from './Score'

const Matches = ({user}) => {
  const navigate = useNavigate()
  return ( 
    <div id="matches">
      <Row className=''>
        <Col className='matches-border'>
          <Score user={user} />
        </Col>
        <Col className='matches-border'>
          {/* Matches */}
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
        </Col>
      </Row>
    </div>
  );
}
 
export default Matches;