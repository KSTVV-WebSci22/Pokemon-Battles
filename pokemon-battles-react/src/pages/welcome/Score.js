import { Row, Col } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const Score = ({user}) => {

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: ['Wins', 'Loss'],
    datasets: [
      {
        label: 'Wins and Losses',
        data: [user.win, user.loss],
        backgroundColor: [`green`, 'red'],
      }
    ]
  };

  return ( 
    <>
      <h4>Overall Score</h4>
      <Row className='mb-3'>
        <Col>
          Wins: <span>{user.win}</span><br/>
          Losses: <span>{user.loss}</span><br/>
          Win Ratio: <span>{user.win > 0 ? user.win / (user.win + user.loss) : 'No wins'}</span>
        </Col>
        <Col>
          <Pie data={data} />
        </Col>
      </Row>
    </>
  );
}
 
export default Score;