import './Profile.css'
import Back from '../../components/Back';
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../context/ClientContext';
import { Button, FloatingLabel, Form, Modal, Row, Col } from 'react-bootstrap';
import { ref, set} from 'firebase/database';
import Navbar from '../../components/Navbar';

// Firebase
import { auth, rdb} from '../../util/Firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase Users
import { getUser, updateUser, getUserStatus } from '../../util/users/Users';


const Profile = () => {
    let navigate = useNavigate();
    const [uid, setUID] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [editUsername, setEditUsername] = useState(false)

    // Context
    const{ setSong, setLoading } = useContext(ClientContext);

    const logout = () => {
        const userStatusDatabaseRef = ref(rdb, 'status/' + auth.currentUser.uid + '/state');
        set(userStatusDatabaseRef, "offline");
        signOut(auth)
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const userInfo = async (uid) => {
        const user = await getUser(uid);
        setUsername(user.username)
        setEmail(user.email)
        setProfilePic(user.profilePic)
    }
    
    useEffect(() => {
        setSong(2)
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is Signed In
              setUID(user.uid);
              userInfo(user.uid);
              setLoading(false)
            } else {
              // User is signed out
              navigate('/');
            }
        })

    }, []);

    return ( 
        <div id="profile" className="content">
            <Back name={'Back'} to={"/welcome"} />
            <div className="content-item">
                <Navbar />
                <div className='profile-info'>
                
                <div className="user-info">
                    <img src={profilePic} alt="Profile"/>
                    <h1>
                        {username} <br/>
                        <Button 
                            className='btn-sm btn-danger'
                            onClick={()=>{setEditUsername(true)}}
                        >Edit</Button>
                    </h1>
                </div>

                    {/* Username */}
                    

                    {/* Email */}
                    <h4 className='mt-5'>Email:</h4>
                    <h5>{email}</h5>

                <hr />

                <button onClick={logout} className="sbutton">Logout</button>
                </div>
            </div>

            <Modal
                show={editUsername}
                onHide={()=>{setEditUsername(false)}}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Change Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <small>
                    Requirements: <br/> 
                    6 Characters Minimum<br/>
                </small>
                <FloatingLabel 
                    controlId="usernameUpdate" 
                    label="username"
                    className='mt-3'
                >
                    <Form.Control 
                        type="text" 
                        placeholder="username" 
                        defaultValue={username}
                        onChange={(e)=>{
                            setUsername(e.target.value)
                        }}
                    />
                </FloatingLabel>    
                <small><span className='text-danger fw-bold'>Warning: Any usernames created that are deemed to be inappropriate, will be permanantly banned.</span></small>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={()=>{setEditUsername(false)}}>
                    Cancel
                </Button>
                {username.length >= 6 && <Button 
                    variant="success"
                    onClick={()=>{
                        updateUser(username)
                        setEditUsername(false)
                    }}    
                >Update</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
}
 
export default Profile;