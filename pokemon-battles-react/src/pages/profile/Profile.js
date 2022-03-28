import './Profile.css'
import Back from '../../components/Back';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUser, updateUser } from '../../util/Firebase';
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../../context/ClientContext';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';

const Profile = () => {
    let navigate = useNavigate();
    const [uid, setUID] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [editUsername, setEditUsername] = useState(false)

    // Context
    const{ setSong } = useContext(ClientContext);

    const logout = () => {
        signOut(auth)
            .then(() => {
                navigate('/')
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
            } else {
              // User is signed out
              navigate('/');
            }
        })

    }, []);

    return ( 
        <div className="content">
            <Back name={'Back'} to={"/welcome"} />
            <div id="profile" className="content-item">

                {/* Profile Pic */}
                <img src={profilePic} alt="Profile" />

                <div className="user-info">
                    {/* Username */}
                    <h4 className='mt-3'>Username:</h4>
                    <h5>
                        {username} 
                        <Button 
                            className='btn-sm btn-danger'
                            onClick={()=>{setEditUsername(true)}}
                        >Edit</Button>
                    </h5>

                    {/* Email */}
                    <h4 className='mt-5'>Email:</h4>
                    <h5>{email}</h5>
                </div>

                <hr />

                <button onClick={logout} className="sbutton">Logout</button>
                
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
                        onChange={(e)=>{setUsername(e.target.value)}}
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
                        updateUser(uid, username)
                        setEditUsername(false)
                    }}    
                >Update</Button>}
                </Modal.Footer>
            </Modal>
        </div>
    );
}
 
export default Profile;