import './PokemonStats.css';

const PokemonStats = ({poke}) => {

  const getMoves = (move) => {
    return move.map(m => {
      console.log(m)
      if(m) {
        return (
          <div className="moves">
            <div className='d-flex w-100'>
              <div className="move">
                {m.name}
                <div className="power" style={{backgroundColor: `${m.type.toLowerCase()}`}} >
                  {m.pp}/{m.pp}
                </div>
              </div>
            </div>
          </div>
        )
      } else {
        return (
          <div className="moves">
            <div className='d-flex w-100'>
              <div className="move">
                Empty
                <div className="power" style={{backgroundColor: `black`}} >
                  none
                </div>
              </div>
            </div>
          </div>
        )
      }
    })
  }

  return ( 
    <div id='pokemon-stats'>
      {/* Pokemon Image */}
      <div className='pokemon-stats-img' >
        <img className="" src={require("../img/pokemon/" + poke.identifier + ".png")} alt={"my pokemon"} />
      </div>

      <div className='pokemon-stats-words'>
              {/* Name */}
              <h2>
                <span style={{color: `var(--${poke.type1.toLowerCase()})`}}>
                  {poke.identifier}
                </span>
                <span className='pokemon-stats-level'>
                  {poke.current_level}
                </span>
              </h2>


              {/* Type */}
              <div className="pokemon-stats-text">
                <div className="yellow-text fw-bold">Type</div>
                <div>
                  <span className='pokemon-stats-type me-2'
                    style={{backgroundColor: `var(--${poke.type1.toLowerCase()})`}}
                  >{poke.type1}</span> 
                  {poke.type2 !== "None" ? 
                    <span className='pokemon-stats-type'
                      style={{backgroundColor: `var(--${poke.type2.toLowerCase()})`}}
                    >{poke.type2}</span> 
                    : ""}
                </div>
              </div>
              
              {/* Moves */}
              <div className='fw-bold mt-2 yellow-text'>Moves</div> 
              <div className="row-cols-1">
                {getMoves(poke.moves)}
              </div>
            </div>
          </div>
  );
}
 
export default PokemonStats;