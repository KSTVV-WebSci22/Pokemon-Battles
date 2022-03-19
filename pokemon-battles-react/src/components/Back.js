import './Back.css'
import { Link } from 'react-router-dom';

const Back = ({name, to}) => {
    return ( 
      <button id="back">
          <Link to={to}>
            {name}
          </Link>
      </button>  
    );
}
 
export default Back;