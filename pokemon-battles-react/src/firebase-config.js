// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import {getAuth, GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2eABQ11POuOO0nf3jGR2-wjQoGrGN11g",
  authDomain: "pokemon-battle-rpi.firebaseapp.com",
  projectId: "pokemon-battle-rpi",
  storageBucket: "pokemon-battle-rpi.appspot.com",
  messagingSenderId: "352748750837",
  appId: "1:352748750837:web:f99af77d02bb170ca742bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);           // Database
export const auth = getAuth(app);                   // Authorization
export const provider = new GoogleAuthProvider();   // Google Authorization
