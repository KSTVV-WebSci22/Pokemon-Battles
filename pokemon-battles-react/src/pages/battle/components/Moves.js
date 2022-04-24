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
                <button className="moves2" title={move.flavor_text}>
                    <div className="move-name">{move.name}</div>
                    <div 
                        className="move-info" 
                        style={{backgroundColor: `var(--${(move.type).toLowerCase()})`}}
                    >
                        {move.type ? <div>{move.type}</div> : <></>}
                        <div>{move.pp}/{move.pp}</div>
                    </div>
                    <div className="move-name move-des">
                        {move.flavor_text}
                    </div>
                </button>
            }
        </>
     ); 
}
 
export default Moves;