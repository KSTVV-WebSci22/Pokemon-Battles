import { useState, useEffect } from 'react';
import './Friends.css'
import fist from '../welcome/fist.png'
import ash from '../../img/people/ashketchum.png'
import add from '../../img/components/add.png'
import cancel from '../../img/components/cancel.png'
import Back from '../../components/Back'
import { auth, db, rdb } from '../../util/Firebase';
import { collection, getDocs, where, query, updateDoc, doc } from "firebase/firestore";
import { getMyFriends, getPresence, getUsername, getUser} from '../../util/users/Users'
import { ClientContext } from '../../context/ClientContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Friends = () => {
    const { setLoading } = useContext(ClientContext);
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);
    
    useEffect(() => {setLoading(false)}, []);
    
    const [addFriend, setAddFriend] = useState(false);

    const AddFriend = async (uid) =>{  
      
      setAddFriend(false);
     
      let ids = [];
      var input = document.getElementById("friend-input").value;
    
      const q = query(collection(db, "users"), where("username", "==", input));
      const querySnapshot = await getDocs(q);
      if(querySnapshot.size == 0){
          alert("User not found");
      }
      else{
            console.log("user found");
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                ids.push(doc.id);
            });
            let myfriends = await getMyFriends(uid)
            if(myfriends.includes(ids[0])){
                alert("User already added");
            }
            else{
                myfriends.push(ids[0]);
                var userStatusFirestoreRef = doc(db, '/users/' + uid);
                var uf = {
                friends: myfriends
                };
                updateDoc(userStatusFirestoreRef, uf);
                getFriendList()
            }
     }
    
    }

    const getFriendList = async () => {
        if(auth.currentUser){
            var tmpFriends = await getMyFriends(auth.currentUser.uid);
            var a = [];
            for(let x of tmpFriends){
                a.push({Name: await getUsername(x), Online: await getPresence(x)});
            };
            setFriends(await a);
        } else {
            navigate("/");
        }
    }

    useEffect(async () => {
        getFriendList()
    }, []);


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
                   {console.log(friends)}
                        <div id="friends-list">
                            <h3 className="friends-h">Online</h3>
                            {friends && friends.map((x, i) => {
                                if(x.Online === "online") {
                                    return <><div key={i} className="menu-item friend-online">
                                                <img className="profile-pic" src={ash} alt="ash"/>
                                                {x.Name}
                                                <button className="menu-item battle-btn" title="Battle"> 
                                                    <img src={fist} alt="fist"/> 
                                                    <img src={fist} alt="fist"/> 
                                                </button>
                                            </div></>
                                }   
                            })}
                            <h3 className="friends-h">Offline</h3>
                            {friends && friends.map((x, i) => {
                                if(x.Online === "offline") {
                                    return <><div key={i} className="menu-item friend-offline">
                                                <img className="profile-pic" src={ash} alt="ash"/>
                                                {x.Name}
                                            </div></>  
                                }   
                            })}
                        </div>
                    </div>
                </div>
                </>
                :
                <div id="friends" className="content-item add-friend-div">
                    <div className="form-floating mb-3">
                        <input type="text"  id="friend-input" className="menu-item form-control" placeholder="Friend Name"/>
                        <label id="friend-input-label" htmlFor="friend-input">Friend Name</label>
                    </div>
                    <div id="friend-results">
                        <h3>Please Enter a Name</h3>
                    </div>
                    <div id="friend-foot">
                    <div id="add" className="menu-item add-friend-btn" onClick={()=>AddFriend(auth.currentUser.uid)}>Add Friend
                        <img src={add} alt="add"/> 
                        <img src={add} alt="add"/> 
                    </div>
                    <div id="cancel-friend" className="menu-item add-friend-btn" onClick={()=>setAddFriend(false)}>Cancel
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