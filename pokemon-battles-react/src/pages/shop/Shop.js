import { useState, useEffect, useRef, useContext } from 'react';
import './Shop.css';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import ShopItem from './components/ShopItem';
import { ClientContext } from '../../context/ClientContext';
import Back from '../../components/Back'


const Shop = () => {
	let [shopItems, setShopItems] = useState();
	const website = useContext(ClientContext)

	const getShopItems = async () => {
		await axios.get("http://localhost:3001/api/shop/mystery-egg")
		.then( res => {
			setShopItems(res.data)
		})
		.catch((error) => {
			console.log(error)
		})
	}

	useEffect( () => {
		getShopItems();
    }, []);


	return (
		<>
			<div id="shop" className="content">
			<Back name="Back" to="/welcome" />
				<h3>Shop</h3>
				<div id='shop-container'>
					<Row md={2} id='shop-row' className='row-cols-2'>
						{
							shopItems && shopItems.map((item) => (
								<div>
									<ShopItem className="itemCard" item={item}/>
								</div>
							))
						}
					</Row>
				</div>
			</div>
		</>
	);

}

export default Shop;
