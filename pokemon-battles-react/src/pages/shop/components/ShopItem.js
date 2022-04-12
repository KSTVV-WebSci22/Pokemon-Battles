import { useState, useEffect, useContext } from 'react';
import './ShopItem.css';
import { Card, Button, Modal, Col } from 'react-bootstrap';
import { ClientContext } from '../../../context/ClientContext';

// Firebase
import { auth } from '../../../util/Firebase'
import { getUser } from '../../../util/users/Users';

const ShopItem = ({item, show}) => {

	const {website, setShopItem, shopModal, setShopModal} = useContext(ClientContext);
	const [itemImg, setImage] = useState(null);

	const setItem = async () => {
		if (item.type === 'mystery-egg') {
			const response = await import(`../../../img/eggs/${item.description}.png`);
			setImage(response.default);
		}
	};

	// generate pop up showing obtained pokemon
	// const showPokemon = async (pokemonId) => {
	// 	let {data: pokemondata} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
	// 	let imgsrc = pokemondata.sprites.other.dream_world.front_default;
	// 	return (<><Modal><Modal.Img src={imgsrc}></Modal.Img></Modal></>)
	// }

	useEffect(() => {
		setItem();
	}, []);

	return (
		<>{item &&
			<Col md={6}>
				<Card className='shop-item'>
					<Card.Img className='shop-item-img' variant='top' src={itemImg}/>
					<div className="shop-item-name">{item.name}</div>
					<Button 
						className="shop-item-purchase mt-auto mb-3"
						style={
							{
								border: 'None'
							}
						}
						onClick={()=>{
							setShopItem(item)
							setShopModal(true)
						}}
					>
						{item.cost}
					</Button>
				</Card>
			</Col>
		}
		</>
	)
}

export default ShopItem;