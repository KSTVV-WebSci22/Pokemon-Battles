import './PokemonStats.css';
import { Form } from 'react-bootstrap';
import { updatePokemonList } from '../util/users/Users'


const PokemonStats = ({poke, showMoves, list, index, updateList}) => {

  const swapPokemon = async (indexB) => {
    var arr = list
    var temp = arr[index];
    arr[index] = arr[indexB];
    arr[indexB] = temp;

    const updated = await updatePokemonList(arr)
    console.log(updated)
    if (updated) {
      console.log(updated)
      updateList()
    }
  };

  const getMoves = (move) => {
    return move.map(m => {
      if(m) {
        return (
          <div className="moves">
            <div className=' w-100'>
              <div className="move">
                {m.name}
                <div className="power" style={{backgroundColor: `var(--${m.type.toLowerCase()})`}} >
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
                <div className="power" style={{backgroundColor: `gray`}} >
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
      {/* Pokemon Text */}
      <div className='pokemon-stats-words'>
        <div className="pokemon-stats-bg" style={{backgroundImage: "url(" + require("../img/pokemon/"+ poke.identifier + ".png") + ")"}}>
              {/* Name */}
              <h4>
                <div className='pokemon-stats-name' style={{color: `var(--${poke.type1.toLowerCase()})`}}>
                  <span className='pokemon-stats-level'>
                    {poke.current_level}
                  </span>
                  {poke.identifier}
                </div>
              </h4>


              {/* Type */}
              <div className="pokemon-stats-text">
                <div className="yellow-text fw-bold">Type</div>
                <div>
                  {/* Type 1 */}
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
            </div>
            {showMoves && <>
            {/* Moves */}
            <div className='fw-bold mt-2 yellow-text pokemon-stats-moves'>
              Moves
              <span className='float-end'>
                <Form.Select 
                  size="sm"
                  onChange={(e)=>{
                    swapPokemon(e.target.value)
                  }}
                >
                  <option selected disabled>Swap with</option>
                  {list && list.map((item, key) => {
                    return (
                      <option value={key}>{item.current_level} {item.identifier}</option>
                    )
                  })}
                </Form.Select>
              </span>
            </div> 
            <div className="row-cols-1">
              {getMoves(poke.moves)}
            </div>
            </>}
      </div>
    </div>
  );
}
 
export default PokemonStats;