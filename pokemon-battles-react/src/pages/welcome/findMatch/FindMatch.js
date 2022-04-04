import { Row, Col, Modal, Button } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Score = ({user}) => {
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: [`${user.win} Win(s)`, `${user.loss} Loss`],
    datasets: [
      {
        label: 'Wins and Losses',
        data: [user.win, user.loss],
        backgroundColor: [`#FEC902`, '#4a4a4a'],
      }
    ]
  };

  return ( 
    <>
      <h4>Matches <button className='stats' onClick={handleShow}>Stats</button></h4>
      <Row className='mb-3'>
        <Col>
          <button 
            onClick={()=>{ navigate('/battle') }}
            className='find-match'
          >Find Match</button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <h5>Wins and Losses</h5>
        <Pie data={data} />
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
    </>
  );
}
 
export default Score;