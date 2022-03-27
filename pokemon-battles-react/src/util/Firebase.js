import { initializeApp } from "firebase/app";

// Firebase Login Authorization
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

// Firebase FireStore
import { getFirestore, setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC2eABQ11POuOO0nf3jGR2-wjQoGrGN11g",
  authDomain: "pokemon-battle-rpi.firebaseapp.com",
  projectId: "pokemon-battle-rpi",
  storageBucket: "pokemon-battle-rpi.appspot.com",
  messagingSenderId: "352748750837",
  appId: "1:352748750837:web:f99af77d02bb170ca742bc"
};

// Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Database
export const db = getFirestore(app);

// Firebase Authorization
export const auth = getAuth(app);

// ----- Functions --------- //
const addUser = (user, uid, name, email, profilePic) => {
  const docData = {
    username: null, 
    legalName: name, 
    email: email,
    profilePic: profilePic
  }

  setDoc(user, docData, { merge: true })
    .then(result => {
      console.log("Added to database")
    })
    .then(error => {
      console.log(error)
    })
}

const checkIfUserExists = async (user, uid, name, email, profilePic) => {
  const docData = await getDoc(user)
  
  if(docData.exists()) {
    console.log("Welcome Back")
  } else {
    console.log("new user")
    addUser(user, uid, name, email, profilePic);
  }
}

export const getUser = async (uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    return docData.data();
  } 
}

export const updateUser = async (uid, username) => {
  const user = doc(db, 'users/', uid)
  await updateDoc(user, {
    username: username
  }).then(() =>{
    return true
  }).catch(error => {
    console.log(error);
  });
}


// Login with Google
export const signInWithGoogle = async () => {  

  // Provider
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result)=>{
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      const verified = result._tokenResponse.emailVerified;
      const uid = result.user.uid;

      localStorage.setItem("name", name)
      localStorage.setItem("email", email)
      localStorage.setItem("profilePic", profilePic)
      localStorage.setItem("verified", verified)

      

      // writeUserData(uid, name, email, profilePic)

      const user = doc(db, 'users/' + uid)
      checkIfUserExists(user, uid, name, email, profilePic);

      return verified
    })
    .catch((error)=>{
      console.log(error)
    })
}
