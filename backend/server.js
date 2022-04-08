const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const moveData = require("./data/movedata.json");
const moveList = require("./data/movelist.json");
const pokemonData = require("./data/pokemondata.json");
const typeData = require("./data/typedamage.json");
const typeConvert = require("./data/types.json");
const pokestats = require("./data/stats.json");

// Cors
var cors = require("cors");


app.get('/api', (req, res) => {
  res.json("Working");
});

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: [
      "GET", "POST", "DELETE", "PUT"
  ],
  credentials: true
}));

// Pokemon Moves
app.get('/api/move/:id', (req, res) => {
  var id = req.params.id;
  var move = {};
  moveList.every(y => {
    if(id == y.move_id){
      move = {...y, ...moveData.move[y.move_id]};
      return false;
    }
    return true;
  });
  res.json(move);
});

// Pokemon
app.get('/api/pokemon/:id', (req, res) => {
  var id = req.params.id;
  let pokemon = {...pokemonData[id]};
  let t1 = typeConvert.types[String(pokemon['type1'])].identifier;
  let t2 = typeConvert.types[String(pokemon['type2'])].identifier;
  
  pokemon['type1'] = t1;
  pokemon['type2'] = t2;
  res.json(pokemon);
});

app.get('/api/newPokemon/:id/:level', (req, res) => {
  var id = req.params.id;
  let pokemon = {...pokemonData[id]};
  let t1 = typeConvert.types[String(pokemon['type1'])].identifier;
  let t2 = typeConvert.types[String(pokemon['type2'])].identifier;
  
  pokemon['type1'] = t1;
  pokemon['type2'] = t2;
  pokemon['hp'] = pokestats[parseInt(id)].hp;
  pokemon['attack'] = pokestats[parseInt(id)].attack;
  pokemon['defense'] = pokestats[parseInt(id)].defense;
  pokemon['specialatk'] = pokestats[parseInt(id)].specialatk;
  pokemon['specialdef'] = pokestats[parseInt(id)].specialdef;
  pokemon['speed'] = pokestats[parseInt(id)].speed;
  pokemon.win = 0
  pokemon.loss = 0
  pokemon.final_win = 0 
  pokemon.current_level = req.params.level

  const moves = []

  const array = moveList.filter(obj => {
    // Filter by Pokemon ID, Pokemon Moves from Evolving, and Pokemons Level 
    return obj.pokemon_id === parseInt(id) && obj.pokemon_move_method_id === 1 && obj.level <= 5
  })
  array.map((move)=>{
    moves.push(
      moveData.find(obj => { return obj.id === move.move_id })
    )
  })
  let i = moves.length
  for(i; i < 4; i++){
    moves.push(null)
  }
  pokemon.moves = moves
  res.json(pokemon);
});


// Pokemon Type
app.get('/api/type/:type', (req, res) => {
  var type = req.params.type;
  res.json(typeData.type_damage[type]);
});

app.get('/api/typeDamage/', (req, res) => {
  res.json(typeData.type_damage);
});


// Pokemon Rarity
app.get('/api/pokemon/:rarity', (req, res) => {
  var rarity = req.params.rarity;
  // res.json(typeData.type_damage[rarity]);
});

// Pokemon Shop Item - 1
app.get('/api/shop/:shopItem', (req, res) => {
  var shopItem = req.params.shopItem;
});


// Listen
app.listen(port, () => {
  console.log('Listening on *:3001')
})

