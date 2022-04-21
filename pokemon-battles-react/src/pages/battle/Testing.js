// Both Players are ready.  Calculatre Moves.

const calculations = () => {

    var p1turn = [];
    var p2turn = [];
    
    
    // Read the database for that battle document.
    // Parse the information and grab:
        // Player 1s turn
        // Player 2s turn
    // Calculate the moves and put into a new array.
}

const changePokemon = async () => {
    // Change pokemon here.  Return true when done.
    const changed = await doChange()
    if(changed){
        moveCheck()
    }
}

const moveCheck = () => {
    if (Player1 === "ready" && Player2 === "ready" ){
        calculations()
    } else {
        // If both players are not ready, we are waiting on one or both to make a move.

        // Check if one of the pokemon is less than or equal to 0 
        if(CurrentPlayer1PokemonHp <= 0 || CurrentPlayer2PokemonHp <= 0){
            if(CurrentPlayer1PokemonHp <= 0){
                changePokemon(CurrentPlayer1Pokemon)
                moveCheck()
            } else {
                changePokemon(CurrentPlayer2Pokemon)
                moveCheck()
            }

        // Check if neither are <= 0.  Then this option. 
        } else {
            // Player 1's Turn or Waiting
            if (Player1 === "ready" ) {
                // Display Waiting on opponent 
            } else {
                // Show The options for attack or change pokemon.  
                // Once done, set player1 to ready
                // Player 1 Ready
            }
        
            // Player 2's Turn or Waiting
            if (Player2 === "ready" ) {
                // Display Waiting on opponent 
            } else {
                // Show The options for attack or change pokemon.  
                // Once done, set player1 to ready 
                // Player 2 Ready
            }
        }    
    }
    
}

// On snapshot change run moveCheck()