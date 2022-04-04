import './Matches.css'
import { Row, Col } from 'react-bootstrap'
import Score from './findMatch/FindMatch'
import WelcomeParty from './welcomeParty/WelcomeParty'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Firebase
import { auth } from '../../util/Firebase'
import { getUser } from '../../util/users/Users'

const Matches = () => {

  let navigate = useNavigate()
  const [user, setUser] = useState()

  const userInfo = async (uid) => {
    const info = await getUser(uid)
    setUser(info)
  }

  useEffect(() => {
    if(auth.currentUser){
      userInfo(auth.currentUser.uid)
    } else {
      navigate('/')
    }
  }, []);
  
  return ( 
    <div id="matches">
      {user ? <>
      <Row className=''>
        <Col className='matches-border'>
          <Score user={user} />
        </Col>
        <Col className='matches-border'>
          <WelcomeParty user={user}/>
        </Col>
      </Row>
      </>:<></>}
    </div>
  );
}
 
export default Matches;