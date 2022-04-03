import './Matches.css'

const Matches = ({user}) => {


  return ( 
    <div id="matches">
      <h4>Score</h4>
      <div id="score-board">
        <div>Wins: {user.win}</div>
        <div>Losses: {user.losses}</div>

      </div>
      <h4>Matches</h4>
      <div id="match-find">
        <button>Find Match</button>
      </div>
      <h4>Recent Matches</h4>
      <div id="recent">
        user
      </div>

    </div>
  );
}
 
export default Matches;