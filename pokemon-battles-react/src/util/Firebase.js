import { initializeApp } from "firebase/app";

// Firebase Login Authorization
import { getAuth } from 'firebase/auth'

// Firebase FireStore
import { getFirestore } from 'firebase/firestore'

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

