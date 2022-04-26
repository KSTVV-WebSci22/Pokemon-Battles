# Pokemon-Battles
# Log

Sean - 3/27
- Firebase Auth - Google Login
- Firebase Database - FireStore Database
- Scheme for database
- Username Edit
- New User Splash

Sean - 4/2
- grab starter pokemon function `newPokemon`
- party section pull pokemon from database
- new first pokemon splash screen

Viano - 4/4
- Get Pokemon info from database for battle

Tobey - 4/8
- pokemondata.json to include basic info about each pokemon (id, evolution, type, name, etc)
- typesdamage.json to specificy damage modifiers for type1 vs type2
- stats.json including base stats for each pokemon (hp, attack, defense, special atk, special def)
- damage calculation implemented when selecting a move (opponent pokemon hp decreases accordingly)

Viano - 4/8
- don't join your own game (db query)
- send a turn indicating that you lost (all pokemon dead)
- x state: when a pokemon dies -> go to switch -> move selection (currently it just switches to next alive pokemon)
- new key/value in turn: Summary of turn

**Kyle 4/12**
Branch: shopUpdate

### Backend: 
Made 2 endpoints in server to pass shop items to front end, and to pass pokemon id and name that was selected by probability ranges.

New json file shopItems.json

### Frontend:
util/users/User.js: addToWallet(value) updates user's wallet. Value can be negative. 

user and setUser are now global variables in ClientContext, declared in App.js

**warning** addToWallet doesn't check if balance goes below zero yet
