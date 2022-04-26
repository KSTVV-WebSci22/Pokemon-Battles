
import { doc, query, where, collection, getDocs, getDoc, updateDoc, setDoc, increment, serverTimestamp as fsTime } from "firebase/firestore";



import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth,  db, rdb } from "../Firebase";
import { getDatabase, ref, onValue, push, onDisconnect, set, get, serverTimestamp} from "firebase/database";
import { Alert } from "react-bootstrap";


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
      checkIfUserExists(user, name, email, profilePic);

      return verified
    })
    .catch((error)=>{
      console.log(error)
    })
}

export const getFRecords = async (uid) => {
  var records = [];
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  const f = docData.data().friends
  //console.log(f);
  for(const id of f) {
    console.log(id);
    var d = await getUser(id)
    console.log(d);
    var record = {
      user: d.username,
      win: d.win,
      loss: d.loss
    }
    records.push(record)
  }
  records.sort((a,b) => (a.win < b.win) ? 1 : (a.win === b.win) ? ((a.loss > b.loss) ? 1 : (a.loss === b.loss) ? ((a.user > b.user) ? 1 : -1): -1) : -1);
  return records;
}

export const getAllRecords = async () => {
  var records = [];
  const users = await getDocs(collection(db, 'users'));
  users.forEach((doc) => {
    //console.log(doc.data());    
    var r = {
      user: doc.data().username,
      win: doc.data().win,
      loss: doc.data().loss
    }
    records.push(r);
    //console.log(doc.data().username, " => ", doc.data().win +' '+ doc.data().loss);
  });
  records.sort((a,b) => (a.win < b.win) ? 1 : (a.win === b.win) ? ((a.loss > b.loss) ? 1 : (a.loss === b.loss) ? ((a.user > b.user) ? 1 : -1): -1) : -1);
  return records;
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
const checkIfUserExists = async (user, name, email, profilePic) => {

  const newUser = () => {
    const docData = {
      username: null, 
      legalName: name, 
      email: email,
      profilePic: profilePic,
      wallet: 10,
      friends: [],
      pokemon: [],
      backpack: [],
      win: 0,
      loss: 0
    }
  
    setDoc(user, docData, { merge: true })
      .then(result => {
        console.log("Added to database: " + result)
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
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.size == 0){
    const user = doc(db, 'users/', auth.currentUser.uid)
    await updateDoc(user, {
      username: username
    }).then(() =>{
      return true
    }).catch(error => {
      console.log(error);
    });
  }
  else{
    Alert("Username already in use!")
 }
}

// Update Users Info
export const updateUserBattleStats = async (wallet, win, loss, pokemon) => {
  const user = doc(db, 'users/', auth.currentUser.uid)
  await updateDoc(user, {
    wallet: wallet,
    loss: loss,
    win: win,
    pokemon: pokemon
  }).then(() =>{
    return true
  }).catch(error => {
    console.log(error);
  });
}


// Update Pokemon List with new Pokemon
export const addPokemon = async (pokemon) => {
  const user = doc(db, 'users/', auth.currentUser.uid)
  let myPokemon = await getMyPokemon(auth.currentUser.uid)
  myPokemon.push(pokemon)
  await updateDoc(user, {
    pokemon: myPokemon
  }).then(()=>{
    return true
  }).catch(() =>{
    return false
  })
}

export const switchPokemon = async (index1, index2) => {
  const user = doc(db, 'users/', auth.currentUser.uid)
  let myPokemon = await getMyPokemon(auth.currentUser.uid)
  // myPokemon.push(pokemon)
  


  await updateDoc(user, {
    pokemon: myPokemon
  }).then(()=>{
    return true
  }).catch(() =>{
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

//Get Users Friends
export const getMyFriends = async(uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    return docData.data().friends;
  } else {
    return false
  }
}

//Get Users Profile Pic
export const getProfilePic = async(uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    return docData.data().profilePic;
  } else {
    return false
  }
}

//Get Users username
export const getUsername = async(uid) => {
  const user = doc(db, 'users/' + uid)
  const docData = await getDoc(user)
  if(docData.exists()) {
    console.log(docData.data().username)
    return docData.data().username;
  } else {
    return false;
  }
}

//Get Users online status
export const getPresence = async(uid) => {
  var p;
  const snapshot = await get(ref(rdb, 'status/' + uid + '/state'));
  p = snapshot.val();
  console.log(p)
  return p
}

//Get User Status
export const getUserStatus = async(uid) => {
  

  // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
  // any time that connectionsRef's value is null (i.e. has no children) I am offline
  
  const userId = uid;
  const userStatusDatabaseRef = ref(rdb, 'status/' + userId );
  
 
  
  // We'll create two constants which we will write to 
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    state: 'offline',
    lastChanged: serverTimestamp(),
  };

  var isOnlineForDatabase = {
    state: 'online',
    lastChanged: serverTimestamp(),
  };


  var userStatusFirestoreRef = doc(db, '/status/' + userId);

  // Firestore uses a different server timestamp value, so we'll 
  // create two more constants for Firestore state.
  var isOfflineForFirestore = {
      state: 'offline',
      last_changed: fsTime(),
  };

  var isOnlineForFirestore = {
      state: 'online',
      last_changed: fsTime(),
  };



  const connectedRef = ref(rdb, '.info/connected');
  onValue(connectedRef, (snap) => {
  console.log(snap.val());

  if (snap.val() === false) {
  setDoc(userStatusFirestoreRef, isOfflineForFirestore);
    return;
  }
  const con = userStatusDatabaseRef;
  // If we are currently connected, then use the 'onDisconnect()' 
    // method to add a set which will only trigger once this 
    // client has disconnected by closing the app, 
    // losing internet, or any other means.
    // When I disconnect, update the last time I was seen online
    
    onDisconnect(con).set(isOfflineForDatabase).then(function() {
      // The promise returned from .onDisconnect().set() will
      // resolve as soon as the server acknowledges the onDisconnect() 
      // request, NOT once we've actually disconnected:
      // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

      // We can now safely set ourselves as 'online' knowing that the
      // server will mark us as offline once we lose connection.
      set(con, isOnlineForDatabase);

      setDoc(userStatusFirestoreRef, isOnlineForFirestore);
    });



  });





}

// Update User Wallet
export const addToWallet = async( value ) => {
  const user = doc(db, 'users/', auth.currentUser.uid);
  await updateDoc(user, {
    wallet: increment(value)
  }).then(()=> {
    return true
  }).catch(() => {
    return false
  })
}

// Update User Win/Loss
export const addToWin = async () => {
  const user = doc(db, 'users/', auth.currentUser.uid);
  await updateDoc(user, {
    win: increment(1)
  }).then(()=> {
    return true
  }).catch(() => {
    return false
  })
}

export const addToLoss = async () => {
  const user = doc(db, 'users/', auth.currentUser.uid);
  await updateDoc(user, {
    loss: increment(1)
  }).then(()=> {
    return true
  }).catch(() => {
    return false
  })
}
