import { useState, useEffect } from "react";
import axios from "axios";

const Moves = ({url}) => {
    {console.log("url" + url)}

    const [move, setMove] = useState([])
    
    const getMove=()=>{
        axios.get(url)
            .then((response) => {     
                console.log(response.data.type.name)         
                setMove(response.data)
            })
            .catch((error) => {
                console.log(error);
            })
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
                        style={{backgroundColor: `var(--${move.type.name})`}}
                    >
                        {move.type ? <div>{move.type.name}</div> : <></>}
                        <div>{move.pp}/{move.pp}</div>
                    </div>
                </button>
            }
        </>
     ); 
}
 
export default Moves;