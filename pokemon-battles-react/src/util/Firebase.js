import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC2eABQ11POuOO0nf3jGR2-wjQoGrGN11g",
  authDomain: "pokemon-battle-rpi.firebaseapp.com",
  databaseURL: "https://pokemon-battle-rpi-default-rtdb.firebaseio.com",
  projectId: "pokemon-battle-rpi",
  storageBucket: "pokemon-battle-rpi.appspot.com",
  messagingSenderId: "352748750837",
  appId: "1:352748750837:web:f99af77d02bb170ca742bc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {

  return signInWithPopup(auth, provider)
    .then((result)=>{
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;
      const verified = result._tokenResponse.emailVerified;

      localStorage.setItem("name", name)
      localStorage.setItem("email", email)
      localStorage.setItem("profilePic", profilePic)
      localStorage.setItem("verified", verified)

      return verified
    })
    .catch((error)=>{
      console.log(error)
    })
}