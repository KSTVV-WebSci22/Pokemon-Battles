# API.md

app.get('/api/move/:id')

- Returns information of a pokemon move with the specified id
Information includes:

Name, type, power, pp, damage class, flavor text

app.get('/api/pokemon/:id')

Returns information of a pokemon with the specified id
Information includes:

Name, pre-evolution, next evolution, experience, type1 and type 2 id, rarity, obtain id

app.get('/api/newPokemon/:id/:level')

- Returns object of information of a pokemon with the specified id and level
- Includes moves for the new pokemon

app.get('/api/type/:type')
- Returns the damage modifiers for the given type against another type (i.e. water against fire is 200%)

app.get('/api/shop/:itemType')
- Returns “name”, “id”, “description”, “type”, “cost”, “currency type” for all objects of the requested shop item type.

app.get('/api/shop/:itemType/:itemId')
- Returns the “cost”, “currency type”, “return type” (i.e. pokemon), and “return item” for a shop item. “Return item” is defined in “app.get('/api/pokemon/:id')”.
