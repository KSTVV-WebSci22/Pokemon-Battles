import { initializeApp } from "firebase/app";

// Firebase Login Authorization
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
// Firebase Database
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC2eABQ11POuOO0nf3jGR2-wjQoGrGN11g",
  authDomain: "pokemon-battle-rpi.firebaseapp.com",
  databaseURL: "https://pokemon-battle-rpi-default-rtdb.firebaseio.com",
  projectId: "pokemon-battle-rpi",
  storageBucket: "pokemon-battle-rpi.appspot.com",
  messagingSenderId: "352748750837",
  appId: "1:352748750837:web:f99af77d02bb170ca742bc"
};

// Firebase App
const app = initializeApp(firebaseConfig);

// Firebase Database
export const db = getDatabase(app);

// Firebase Authorization
export const auth = getAuth(app);



// Login with Google
export const signInWithGoogle = async () => {  

  const writeUserData = (uid, name, email, profilePic) => {
    const reference = ref(db, 'users/' + uid)

    set(reference, {
      email: email,
      name: name,
      profilePic: profilePic
    })
    
  }

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

      writeUserData(uid, name, email, profilePic)



      return verified
    })
    .catch((error)=>{
      console.log(error)
    })
}

