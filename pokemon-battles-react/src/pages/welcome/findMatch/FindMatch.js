import { Row, Col } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";

const Score = ({user}) => {
  const navigate = useNavigate()

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
      <h4>Matches</h4>
      <Row className='mb-3' xs={1} lg={2}>
        <Col>
          <Pie data={data} />
        </Col>
        <Col>
          <button 
            onClick={()=>{ navigate('/battle') }}
            className='find-match'
          >Find Match</button>
        </Col>
      </Row>
    </>
  );
}
 
export default Score;