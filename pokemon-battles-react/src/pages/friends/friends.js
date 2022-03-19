import { useState, useEffect, useRef } from 'react';
import './Friends.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import add from '../../img/components/add.png'
import cancel from '../../img/components/cancel.png'
import { FloatingLabel, Form} from 'react-bootstrap'

const Friends = () => {
    const [friends, setFriends] = useState([
        {name: 'Viano', online: true}, 
        {name: 'Kyle', online: true},
        {name: 'Sean', online: false},
        {name: 'Tobey', online: true},
        {name: 'Vishal', online: false}
    ]);

    const [addFriend, setAddFriend] = useState(false);

    return (
        <div className='content'>
            {!addFriend ? 
                <>
                <div id="friends" className="content-item">
                    <div className="friends-grid">
                        <div className="add-friend-container">
                            <div id="add-friend" className="menu-item add-friend-btn" onClick={()=>{setAddFriend(true)}}>Add Friend
                                <img src={add} alt="add"/> 
                                <img src={add} alt="add"/> 
                            </div>
                        </div>
                        <div id="friends-list">
                            <h3 className="friends-h">Online</h3>
                            {friends && friends.map((x, i) => {
                                if(x.online) {
                                    return <><div key={i} className="menu-item friend-online">
                                                <img className="profile-pic" src={ash} alt="ash"/>
                                                {x.name}
                                                <button className="menu-item battle-btn" title="Battle"> 
                                                    <img src={fist} alt="fist"/> 
                                                    <img src={fist} alt="fist"/> 
                                                </button>
                                            </div></>
                                }   
                            })}
                            <h3 className="friends-h">Offline</h3>
                            {friends && friends.map((x, i) => {
                                if(!x.online) {
                                    return <><div key={i} className="menu-item friend-offline">
                                                <img className="profile-pic" src={ash} alt="ash"/>
                                                {x.name}
                                            </div></>  
                                }   
                            })}
                        </div>
                    </div>
                </div>
                </>
                :
                <div id="friends" className="content add-friend-div">
                        <FloatingLabel id="friend-input-label" className="mb-3" controlId="floatingFriend" label="Friend Name">
                            <Form.Control id="friend-input" className="menu-item" type="text" placeholder="Friend Name" />
                        </FloatingLabel>
                        <div id="friend-results">
                            <h3>Please Enter a Name</h3>
                        </div>
                        <div id="add" className="menu-item add-friend-btn">Add Friend
                            <img src={add} alt="add"/> 
                            <img src={add} alt="add"/> 
                        </div>
                        <div id="cancel-friend" className="menu-item add-friend-btn" onClick={()=>{setAddFriend(false)}}>Cancel
                            <img src={cancel} alt="cancel"/> 
                            <img src={cancel} alt="cancel"/> 
                    
                    </div>
                </div>
            }
        </div>
     );
}
 
export default Friends;