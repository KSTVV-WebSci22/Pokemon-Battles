import { useState, useEffect, useRef } from 'react';
import './ShopItem.css';
import { Card, Button } from 'react-bootstrap';
import axios from "axios";

const ShopItem = ({itemUrl}) => {

	const [item, setItem] = useState()

	const fetchItem = async () => {

		await axios.get(itemUrl)
		.then((response) => {
			axios.get('https://pokeapi.co/api/v2/pokemon/' + response.data.id)
			.then((response) => {           
				setItem(
					{
						name: response.data.name,
						src: response.data.sprites.other.dream_world.front_default,
						type: response.data.types[0].type.name
					}
				);
			})
			.catch((error) => {
					console.log(error);
			})
		})
		.catch((error) => {
			console.log(error);
		})
	}

	useEffect(() => {
		fetchItem();
	}, []);

	return (
		<>
		{
			item &&
			<Card className='shop-item'>
				<Card.Img className='shop-item-img' variant='top' src={item.src}/>
				<div className="shop-item-name" style={{color: `var(--${item.type})`}}>{item.name}</div>
				<Button 
					className="shop-item-purchase mt-auto mb-3"
					style={
						{
							background: `var(--${item.type})`,
							border: 'None'
						}
					}
				>
					100
				</Button>
			</Card>
		}
		</>
	)
}

export default ShopItem;