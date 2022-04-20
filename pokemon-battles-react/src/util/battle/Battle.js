import { doc, getDoc, getDocs, updateDoc, setDoc, addDoc, arrayUnion, query, where, collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import axios from 'axios';

const battles = collection(db, "battles");
var turn = false;
var prevTurn = {};
var rounds = 0;
var prevTurns = new Set();

//test find batlle
export const findBattle = async (id) => { 
    var prevTurn = {};
    var rounds = 0;
    console.log("find battle"); 
    const find = query(battles, where("user1", "!=", id), where("user2", "==", ""), where("status", "==", "started"));
    const docs = await getDocs(find);
    console.log(docs.docs.length);
    return new Promise((res) => {
        if(docs.docs.length > 0) {
            docs.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                if(doc.data().date <= new Date(new Date().getTime() + 15 * 60000)) { //don't join open battle created more than 15 minutes ago
                    res({docId: doc.id, ...doc.data()});
                }
            });
        }
        res(false);
    });
}

export const takeTurn = async (id, move) => { 
    return new Promise(async (res) => {
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
                res(true);
            }
        }
    });
}

export const sendWin = async (dId, pId) => { 
    const win = doc(db, "battles", dId);
    const update = await updateDoc(win, {
        winner: pId,
        status: "ended"
    });
    return new Promise(async (res) => {
        res(update);
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

const calculate = async (turn1, turn2, id) => { 
    return new Promise(async (res) => {
        var result = {};
        result.winner = null;
        console.log("turn1 => ", turn1);
        console.log("turn2 => ", turn2);
        if(turn1.type == "fainted-switch" || turn2.type == "fainted-switch") {
            let t1 = (turn1.type == "fainted-switch") ? true : false;
            console.log("in fainted switch");
            result = {
                turn1Hp: turn1.hp,
                turn2Hp: turn2.hp,
                turn1Pokemon: turn1.pokemon,
                turn2Pokemon: turn2.pokemon,
                turn1Summary: (t1) ? "Opponent switched to " + turn1.pokemon.identifier : "",
                turn2Summary: (t1) ? "" : "Opponent switched to " + turn2.pokemon.identifier
            }
        } else if (turn2.move == null && turn1.move == null) { // if both are switches
            result = {
                turn1Hp: turn1.hp,
                turn2Hp: turn2.hp,
                turn1Pokemon: turn1.pokemon,
                turn2Pokemon: turn2.pokemon,
                turn1Summary: "Opponent switched to " + turn1.pokemon.identifier,
                turn2Summary: "Opponent switched to " + turn2.pokemon.identifier
            }
        } else if(turn1.move == null || turn2.move == null) { //one is a switch
            let t1 = (turn1.move == null) ? true : false;
            let damage = (t1) ? await damageCalc(turn2.pokemon, turn2.move, turn1.pokemon) : await damageCalc(turn1.pokemon, turn1.move, turn2.pokemon);
            result = {
                turn2Hp: turn2.hp,
                turn1Hp: turn1.hp,
                turn1Pokemon: turn1.pokemon,
                turn2Pokemon: turn2.pokemon,
                turn1Summary: (t1) ? "Opponent switched to " + turn1.pokemon.identifier : "Opponent used " + turn1.move.name + ", it did " + damage + " damage!",
                turn2Summary: (t1) ? "Opponent used " + turn2.move.name + ", it did " + damage + " damage!" : "Opponent switched to " + turn2.pokemon.identifier
            }
            if(t1) {
                if (turn1.hp - damage <= 0) {
                    turn1.pokemonLeft -= 1;
                    result.turn1Hp = 0;
                    result.turn1Summary = "Opponent's " + turn1.pokemon.identifier + " fainted!";
                } else {
                    result.turn1Hp = turn1.hp - damage;
                }
            } else {
                if (turn2.hp - damage <= 0) {
                    turn2.pokemonLeft -= 1;
                    result.turn2Hp = 0;
                    result.turn2Summary = "Opponent's " + turn2.pokemon.identifier + " fainted!";
                } else {
                    result.turn2Hp = turn2.hp - damage;
                }
            }
        } else { //if both are moves
            let first = null;
            if(turn1.speed > turn2.speed) {
                first = 1;
            } else if(turn2.speed > turn1.speed) {
                first = 2;
            } else {
                let random = Math.floor(Math.random() * 2);
                first = (random == 0) ? 1 : 2;
            }
            if(first == 1 || first == 2) {
                let damage1 = await damageCalc(turn1.pokemon, turn1.move, turn2.pokemon);
                let damage2 = await damageCalc(turn2.pokemon, turn2.move, turn1.pokemon);
                result = {
                    turn1Pokemon: turn1.pokemon,
                    turn2Pokemon: turn2.pokemon,
                    turn1Summary: "Opponent used " + turn1.move.name + ", it did " + damage1 + " damage!",
                    turn2Summary: "Opponent used " + turn2.move.name + ", it did " + damage2 + " damage!"
                }
                if(first == 1) {
                    if (turn2.hp - damage1 <= 0) {
                        turn2.pokemonLeft -= 1;
                        result.turn1Hp = turn1.hp;
                        result.turn2Hp = 0;
                        result.turn2Pokemon = null;
                        result.turn1Summary = "Opponent's " + turn2.pokemon.identifier + " fainted!";
                    } else if (turn1.hp - damage2 <= 0) {
                        turn1.pokemonLeft -= 1;
                        result.turn1Hp = 0;
                        result.turn2Hp = turn2.hp - damage1;
                        result.turn1Pokemon = null;
                        result.turn1Summary = "Opponent's " + turn1.pokemon.identifier + " fainted!";
                    } else {
                        result.turn1Hp = turn1.hp - damage2;
                        result.turn2Hp = turn2.hp - damage1;
                    }
                } else {
                    if (turn1.hp - damage2 <= 0) {
                        turn1.pokemonLeft -= 1;
                        result.turn1Hp = 0;
                        result.turn2Hp = turn2.hp - damage1;
                        result.turn1Pokemon = null;
                        result.turn1Summary = "Opponent's " + turn1.pokemon.identifier + " fainted!";
                    } else if (turn2.hp - damage1 <= 0) {
                        turn2.pokemonLeft -= 1;
                        result.turn1Hp = turn1.hp;
                        result.turn2Hp = 0;
                        result.turn2Pokemon = null;
                        result.turn1Summary = "Opponent's " + turn2.pokemon.identifier + " fainted!";
                    } else {
                        result.turn1Hp = turn1.hp - damage2;
                        result.turn2Hp = turn2.hp - damage1;
                    }
                }
            }
        }
        result.turn1 = turn1.userId;
        result.turn2 = turn2.userId;
        result.time = new Date().getTime();
        result.type = "turn-result"
        let size = 0;
        prevTurns.add(result);
        if(prevTurns.size > size) {
            if(turn1.pokemonLeft == 0) {
                result.winner = "turn2";
                await sendWin(id, turn2.userId);
            } else if(turn2.pokemonLeft == 0) {
                result.winner = "turn1";
                await sendWin(id, turn1.userId);
            }
            if(await takeTurn(id, result)) {
                res(result);
            }
    }
    });
}

export const getTurns = async (dId, pId, type) => { 
    // if(turn != false) {
    //     turn();
    // }
    console.log(dId, pId);
    return new Promise(async (res) => {
        turn = onSnapshot(doc(db, "battles", dId), async (doc) => {
            console.log("Turnjh =>", doc.data());
            var lastTurn = doc.data().turns[doc.data().turns.length - 1];
            
                if(doc.data().winner == "") {
                    if(lastTurn != prevTurn) {
                        if(type == 1 && lastTurn.type != "start" && doc.data().turns.length > 2) {
                            console.log("Turn #" + doc.data().turns.length);

                            rounds = 0;
                            doc.data().turns.forEach((x) => {
                                if(x.type == "turn-result") {
                                    rounds += 1;
                                }
                            });
                            
                            if((doc.data().turns.length - rounds ) % 2 == 0 && doc.data().turns[doc.data().turns.length - 2].type != "turn-result" && lastTurn.type != "turn-result" && lastTurn.userId == pId) {
                                prevTurn = await calculate(doc.data().turns[doc.data().turns.length - 2], lastTurn, dId);
                                turn();
                                res(prevTurn);
                            } 
                            
                            if(lastTurn.type == "turn-result") {
                                let size = prevTurns.size;
                                prevTurns.add(lastTurn);
                                if(prevTurns.size > size) {
                                    prevTurn = lastTurn;
                                    turn();
                                    res(lastTurn);
                                }
                            }
                        } else if (type == 0 && lastTurn.type == "start") {
                            if(lastTurn.userId != pId) {
                            turn();
                            console.log("Turn #" + doc.data().turns.length);
                            prevTurn = lastTurn;
                            prevTurns.add(prevTurn);
                            res(lastTurn);
                            }
                        }
                    }
                } else if(doc.data().winner == pId) {
                    turn(); 
                    res("win");
                } else if(doc.data().winner != pId) {
                    turn(); 
                    res("lose");
                }
            
        });
    });
}

const damageCalc = async (pokemon, move, opponent) => {
    return new Promise(res => {
        let h = Math.floor(Math.random() * (101 - 1)) + 1;
        if(h > pokemon.accuracy) {       
            res(0);
        } 
        axios.get("http://localhost:3001/api/typeDamage/").then((response) => {
            console.log(response.data);
            console.log("opponent =>", opponent);
            console.log("me =>", pokemon);
            let t = response.data[move.type];
            let typeDamage1 = t[opponent.type1];
            let typeDamage2 = typeDamage1;
            if(opponent.type2 != 'None') {
                typeDamage2 = t[opponent.type2];
            }
            let totalTypeDamage = (typeDamage1 + typeDamage2) / 2;
            let a = (((2 * pokemon.current_level) / 5) + 2) * move.power ;
            let b = 0;
            let c = 0;
            if(response.data.damage_class == 'physical') {
                b = pokemon.attack;
                c = opponent.defense; 
            } else if (response.data[move.type].damage_class = 'special') {
                b = pokemon.specialatk;
                c = pokemon.specialdef;
            }
            let d = a * b / c;
            let e = (d / 50) + 2;
            let f = e * (totalTypeDamage / 100);
            if(pokemon.type1 == move.type || pokemon.type2 == move.type) {
                f = f * 1.5;
            }
            let g = Math.floor(Math.random() * (101 - 85)) + 85;
            g = g / 100;
            let i = Math.round(f * g);
            console.log("damage => ", i);
            res(i);
        }).catch(err => {
            console.log(err);
        })
    });
}
