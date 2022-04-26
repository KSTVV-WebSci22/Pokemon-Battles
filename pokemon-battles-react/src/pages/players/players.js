import { useState, useEffect, useRef } from 'react';
import './players.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import cancel from '../../img/components/cancel.png'
import add from '../../img/components/add.png'
import { FloatingLabel, Form} from 'react-bootstrap'
import { ref } from 'firebase/database';
import { getAllRecords } from '../../util/users/Users';
import { getFRecords } from '../../util/users/Users';
import Back from '../../components/Back';
import Navbar from '../../components/Navbar'

import { auth } from '../../util/Firebase'
const Players = () => {
    const [records, setRecords] = useState([])
    const [f_records, setFRecords] = useState([])

    const getRecords = async () => {
        const allRecords = await getAllRecords();
        setRecords(allRecords);
        //console.log(allRecords)
    }

    const getFriendRecords = async () => {
        const allFRecords = await getFRecords(auth.currentUser.uid);
        setFRecords(allFRecords);
        //console.log(allFRecords);
    }

    useEffect(() => {
        getRecords()
        getFriendRecords()
    }, []);


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
        
        <div className="content">
            <Back name={'Back'} to={"/welcome"} />

        {
            !friendlist ? 
            <>
            <div id="players" className="content-item">
                <Navbar />
                <div className="players-grid">
                    <div className="add-player-container">
                        <div id="add-player" className="menu-item add-player-btn" onClick={()=>{setFriendList(true)}}>Friends' Rankings
                        </div>
                    </div>
                    <div id="players-list">
                        <h3 className="players-h">Global Rankings</h3>
                        {records && records.map((x, i) => {
                            if(!x.online) {
                                return <><div key={i} className="menu-item player-online">
                                            <h2>{i+1}</h2>
                                            {x.user}<br></br>Wins: {x.win} | Losses: {x.loss}
                                        </div></>
                            }   
                        })}
                        
                    </div>
                </div>
            </div>
            </>
            :
            <div id="players" className="content-item add-player-div">
                <Navbar />
                <div className="players-grid">
                    <div className="add-player-container">
                        <div id="add-player" className="menu-item add-player-btn" onClick={()=>{setFriendList(false)}}>Global Rankings
                        </div>
                    </div>
                    <div id="players-list">
                        <h3 className="players-h">Friend Rankings</h3>
                        {f_records && f_records.map((x, i) => {
                            if(!x.online) {
                                return <><div key={i} className="menu-item friend-rank">
                                            <h2>{i+1}</h2>
                                            {x.user}<br></br>Wins: {x.win} | Losses: {x.loss}
                                        </div></>
                            }   
                        })}
                        
                    </div>
                </div>
            </div>
         }
         </div>
     );
}
 
export default Players;