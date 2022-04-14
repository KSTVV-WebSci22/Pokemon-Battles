import { useState, useEffect, useRef } from 'react';
import './Friends.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import add from '../../img/components/add.png'
import cancel from '../../img/components/cancel.png'
import Back from '../../components/Back'
import { auth } from '../../util/Firebase';
import { setDoc, doc } from "firebase/firestore";
import { db } from '../../util/Firebase';

const Friends = () => {
    const [friends, setFriends] = useState([
        {name: 'Viano', online: true}, 
        {name: 'Kyle', online: true},
        {name: 'Sean', online: false},
        {name: 'Tobey', online: true},
        {name: 'Vishal', online: false}
    ]);


    const [addFriend, setAddFriend] = useState(false);

  const AddFriend = async (uid) =>{
      setAddFriend(false);
    var userStatusFirestoreRef = doc(db, '/users/' + uid);
    var input = document.getElementById('addFriendInput').innerHTML;
    var FriendFirestore = {
      name: input,
    };
    setDoc(userStatusFirestoreRef, FriendFirestore);
   }



    return (
        <div className='content'>
            <Back name="Back" to="/welcome" />
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
                <div id="friends" className="content-item add-friend-div">
                    <div class="form-floating mb-3">
                        <input type="text"  id="friend-input" className="menu-item form-control" placeholder="Friend Name"/>
                        <label id="friend-input-label" for="friend-input">Friend Name</label>
                    </div>
                    <div id="friend-results">
                        <h3>Please Enter a Name</h3>
                    </div>
                    <div id="friend-foot">
                    <div id="add" className="menu-item add-friend-btn">Add Friend
                        <img src={add} alt="add"/> 
                        <img src={add} alt="add"/> 
                    </div>
                    <div id="cancel-friend" className="menu-item add-friend-btn" onClick={()=>{AddFriend(auth.currentUser.uid)}}>Cancel
                        <img src={cancel} alt="cancel"/> 
                        <img src={cancel} alt="cancel"/> 
                    </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default Friends;