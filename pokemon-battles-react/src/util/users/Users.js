import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

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

      // writeUserData(uid, name, email, profilePic)

      const user = doc(db, 'users/' + uid)
      checkIfUserExists(user, uid, name, email, profilePic);

      return verified
    })
    .catch((error)=>{
      console.log(error)
    })
}

// Get User
export const getUser = async (uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    return docData.data();
  } else {
    return false
  }
}

// Check User
const checkIfUserExists = async (user, uid, name, email, profilePic) => {

  const newUser = () => {
    const docData = {
      username: null, 
      legalName: name, 
      email: email,
      profilePic: profilePic,
      wallet: 10,
      pokemon: [],
    }
  
    setDoc(user, docData, { merge: true })
      .then(result => {
        console.log("Added to database")
      })
      .then(error => {
        console.log(error)
      })
  }

  const docData = await getDoc(user)
  
  if(docData.exists()) {
    console.log("Welcome Back")
  } else {
    console.log("new user")
    newUser();
  }
}


// Update Username
export const updateUser = async (username) => {
  const user = doc(db, 'users/', auth.currentUser.uid)
  await updateDoc(user, {
    username: username
  }).then(() =>{
    return true
  }).catch(error => {
    console.log(error);
  });
}


// Update Pokemon
export const addPokemon = async (pokemon) => {
  const user = doc(db, 'users/', auth.currentUser.uid)
  await updateDoc(user, {
    pokemon: arrayUnion(pokemon)
  }).then(()=>{
    return true
  }).catch(error =>{
    return false
  })

}

// Get Users Pokemons
export const getMyPokemon = async(uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    return docData.data().pokemon;
  } else {
    return false
  }
}