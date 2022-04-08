import { doc, getDoc, getDocs, updateDoc, setDoc, addDoc, arrayUnion, query, where, collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";

const battles = collection(db, "battles");
var turn = false;

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
    console.log("send turn => " + id, move);
    const newDoc = doc(db, "battles", id);
    const result = await getDoc(newDoc);
    if(result.exists()) {
        console.log("re => ", move, result.data().turns[result.data().turns.length - 1]);
        if(result.data().turns[result.data().turns.length - 1].time == move.time) {
            console.log("Turn sent");
        }
    }
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
    if(turn != false) {
        turn();
    }
    console.log(dId, pId);
    return new Promise((res) => {
        turn = onSnapshot(doc(db, "battles", dId), (doc) => {
            console.log("Turnjh =>", doc.data());
            if(doc.data().turns[doc.data().turns.length - 1].userId != pId) {
                if( doc.data().winner == "") {
                    turn();
                    console.log("Turn #" + doc.data().turns.length);
                    res(doc.data().turns[doc.data().turns.length - 1]);
                } else if(doc.data().winner == pId) {
                    turn(); //moght have to move after res
                    res("win");
                }
            }
        });
    });
}