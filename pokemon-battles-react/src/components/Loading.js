import loadImg from './loading.gif'
import './Loading.css'
import { ClientContext } from '../context/ClientContext';
import { useContext } from 'react/cjs/react.production.min';

const Loading = () => {
    
    return ( 
        <div id="loading">
            <img src={loadImg} alt="loading" />
            <h5>Loading...</h5>
        </div>
    );
}
 
export default Loading;