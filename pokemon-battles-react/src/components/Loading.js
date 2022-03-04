import loadImg from './loading.gif'
import './Loading.css'

const Loading = () => {
    return ( 
        <div id="loading">
            <img src={loadImg} alt="loading" />
            <h5>Loading...</h5>
        </div>
    );
}
 
export default Loading;