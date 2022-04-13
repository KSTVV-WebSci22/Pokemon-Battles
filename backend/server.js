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
const shopItems = require("./data/shopItems.json")

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


// Pokemon Rarity
app.get('/api/pokemon/:rarity', (req, res) => {
  var rarity = req.params.rarity;
  // res.json(typeData.type_damage[rarity]);
});

// https://www.geeksforgeeks.org/random-number-generator-in-arbitrary-probability-distribution-fashion/
// Utility function to find ceiling of r in arr[l..h]
function findCeil(arr, r, l, h)
{
  let mid;
  while (l < h)
  {
    mid = l + ((h - l) >> 1); // Same as mid = (l+h)/2
    (r > arr[mid]) ? (l = mid + 1) : (h = mid);
  }
  return (arr[l] >= r) ? l : -1;
}
// The main function that returns a random number
// from arr[] according to distribution array
// defined by freq[] (freq[i] is int).
function rand(arr, freq) {
  // Create and fill prefix array
  // e.g. freq: [7, 2, 1], then prefix: [7, 9, 10]
  let n = arr.length;
  let prefix= [];
  let i;
  prefix[0] = freq[0];
  for (i = 1; i < n; ++i)
      prefix[i] = prefix[i - 1] + freq[i];

  // prefix[n-1] is sum of all frequencies.
  // Generate a random number with
  // value from 1 to this sum
  let r = Math.floor((Math.random() * prefix[n - 1])) + 1;

  // Find index of ceiling of r in prefix array
  let index = findCeil(prefix, r, 0, n - 1);
  console.log(r, index, arr[index])
  return arr[index];
}

// respond with all shop items of a chosen type
// http://localhost:3001/api/shop/egg
app.get('/api/shop/:itemType', (req, res) => {
  let itemType = req.params.itemType;
  let result = shopItems[itemType].map(
    item => 
    {
      // return only seleccted fields
      return {
        name: item.name,
        description: item.description,
        id: item.id,
        type: item.type,
        cost: item.cost,
        currency: item.currency
      }
    }
  );
  res.json(result);
});


// http://localhost:3001/api/shop/mysteryegg/id
app.get('/api/shop/:itemType/:itemId', (req, res) => {
  let {itemType, itemId} = req.params;
  console.log(`/api/shop/${itemType}/${itemId} was called`)
  // find the shop item
  let item = shopItems[itemType].find(item => item.id == itemId);
  
  if (itemType == 'mystery-egg') {
    let cost = item.cost;
    let currency = item.currency;
    let rarityTarget = rand(item.raritypool, item.rarityweights);
    // pokemons of obtainmethod == 1 and rarity == target
    let selectedPokemons = pokemonData
    .filter(p => p.rarity == rarityTarget && p.obtain == 1)
    .map(
      p => {
        return {
          id: p.id,
          identifier: p.identifier
        }
    });
    // choose pokemon at random
    let retPokemon = selectedPokemons[Math.floor(Math.random() * selectedPokemons.length)];
    // response data
    res.json({cost: cost, currency: currency, retItem: retPokemon, retType: 'pokemon'});
  } else {
    res.status(404);
  }
});


// Listen
app.listen(port, () => {
  console.log('Listening on *:3001')
})

