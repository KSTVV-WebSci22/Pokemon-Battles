import { doc, getDoc, getDocs, updateDoc, setDoc, addDoc, arrayUnion, query, where, collection, onSnapshot } from "firebase/firestore";
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

export const sendLose = async (dId, pId) => { 
    const lose = doc(db, "battles", dId);
    await updateDoc(lose, {
        winner: pId
    });
}

export const newUser = async (dId, pId) => { 
    const nu = doc(db, "battles", dId);
    await updateDoc(nu, {
        user2: pId
    });
}

export const createBattle = async (data) => { 
    const newDoc = await addDoc(battles, data);
    return new Promise((res) => {
        res(newDoc.id);
    });
}

export const getTurns = async (dId, pId) => { 
    console.log(dId, pId);
    return new Promise((res) => {
        const turn = onSnapshot(doc(db, "battles", dId), (doc) => {
            console.log("Turn ", doc.data());
            if(doc.data().turns[doc.data().turns.length - 1].userId != pId) {
                if( doc.data().winner == "") {
                    res(doc.data().turns[doc.data().turns.length - 1]);
                    turn();
                } else if(doc.data().winner == pId) {
                    res("win");
                    turn();
                }
            }
        });
    });
}