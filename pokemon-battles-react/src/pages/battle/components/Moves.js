import { useState, useEffect } from "react";

const Moves = (moveData) => {

    const [move, setMove] = useState({})
    
    const getMove=()=>{
        setMove({...moveData.moveData})
    }

    useEffect(() => {
        getMove();
    }, []);


    return ( 
        <>
            {move.type && 
                <button className="moves shadow">
                    <div className="move-name">{move.name}</div>
                    <div 
                        className="move-info" 
                        style={{backgroundColor: `var(--${(move.type).toLowerCase()})`}}
                    >
                        {move.type ? <div>{move.type}</div> : <></>}
                        <div>{move.pp}/{move.pp}</div>
                    </div>
                </button>
            }
        </>
     ); 
}
 
export default Moves;