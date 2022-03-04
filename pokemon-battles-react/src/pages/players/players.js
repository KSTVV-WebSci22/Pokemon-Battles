import { useState, useEffect, useRef } from 'react';
import './players.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import cancel from '../../img/components/cancel.png'
import add from '../../img/components/add.png'

import { FloatingLabel, Form} from 'react-bootstrap'

const Players = () => {
    const [ranks, setranks] = useState([
        {name: 'Ash', wins: 68, losses: 1},
        {name: 'Brock', wins: 67, losses: 1},  
        {name: 'Sean', wins: 30, losses: 6},
        {name: 'Viano', wins: 20, losses: 4}, 
        {name: 'Vishal', wins: 15, losses: 12},
        {name: 'Kyle', wins: 10, losses: 10},
        {name: 'Tobey', wins: 1, losses: 35}
    ]);
    const [friendranks, setfriendsranks] = useState([
        {name: 'Ash', wins: 68, losses: 1},
        {name: 'Bob', wins: 8, losses: 3},
        {name: 'Chris', wins: 6, losses: 5},
        {name: 'Dana', wins: 3, losses: 1},
        {name: 'Eric', wins: 1, losses: 1},

    ]);

    const [friendlist, setFriendList] = useState(false);

    return (
        !friendlist ? 
        <>
        <div id="players" className="full-screen">
            <div className="players-grid">
                <div className="add-player-container">
                    <div id="add-player" className="menu-item add-player-btn" onClick={()=>{setFriendList(true)}}>Friends' Rankings
                    </div>
                </div>
                <div id="players-list">
                    <h3 className="players-h">Global Rankings</h3>
                    {ranks && ranks.map((x, i) => {
                        if(!x.online) {
                            return <><div key={i} className="menu-item player-online">
                                        <h2>{i+1}</h2>
                                        {x.name}<br></br>Wins: {x.wins} | Losses: {x.losses}
                                    </div></>
                        }   
                    })}
                    
                </div>
            </div>
        </div>
        </>
        :
        <div id="players" className="full-screen add-player-div">
            <div className="players-grid">
                <div className="add-player-container">
                    <div id="add-player" className="menu-item add-player-btn" onClick={()=>{setFriendList(false)}}>Global Rankings
                    </div>
                </div>
                <div id="players-list">
                    <h3 className="players-h">Friend Rankings</h3>
                    {friendranks && friendranks.map((x, i) => {
                        if(!x.online) {
                            return <><div key={i} className="menu-item friend-rank">
                                        <h2>{i+1}</h2>
                                        {x.name}<br></br>Wins: {x.wins} | Losses: {x.losses}
                                    </div></>
                        }   
                    })}
                    
                </div>
            </div>
         </div>
     );
}
 
export default Players;