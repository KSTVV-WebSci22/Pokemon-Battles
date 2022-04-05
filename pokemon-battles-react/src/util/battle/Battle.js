import { doc, getDoc, getDocs, updateDoc, setDoc, arrayUnion, query, where, collection  } from "firebase/firestore";
import { db } from "../Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

const battles = collection(db, "battles");

//test find batlle
export const findBattle = async () => {
    console.log("find battle"); 
    const find = query(battles, where("user1", "!=", ""), where("user2", "==", ""), where("status", "==", "started"));
    const docs = await getDocs(find);
    console.log(docs.docs.length);
    return new Promise((res) => {
        if(docs.docs.length > 0) {
            docs.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
            res({docId: docs.docs[0].id, ...docs.docs[0].data()});
        } else {
            res(false);
        }
    });
}

export const takeTurn = async (id, move) => { 
    const turn = doc(db, "battles", id);
    await updateDoc(turn, {
        turns: arrayUnion(move)
    });
}

export const newBattle = async () => { 

}