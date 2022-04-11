import { useState, useEffect, useRef, useContext } from 'react';
import './ShopItem.css';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from "axios";
import { ClientContext } from '../../../context/ClientContext';
import { addPokemon } from '../../../util/users/Users';

// Firebase
import { getUser, auth } from '../../../util/Firebase'

const ShopItem = ({item}) => {

	const {website} = useContext(ClientContext);
	const [shopItem, setShopItem] = useState();
	const [itemImg, setImage] = useState(null);
	// handle modal 
	const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	const setItem = async () => {
		if (item.type === 'mystery-egg') {
			const response = await import(`../../../img/eggs/${item.description}.png`);
			setImage(response.default);
		}
		setShopItem(item);
	};

	// const testPokemonAdd = () => {
  //   const random = Math.floor(Math.random() * (151 - 1) + 1);
  //   console.log(random)
  //   axios.get(`${website}/api/newPokemon/${random}/5`)
  //   .then(response => {
  //     addPokemon(response.data)
  //     alert("Test Pokemon Added")
  //   })
  //   .catch( error => {
  //     console.log(error);
  //   })
  // }

	const purchase = async () => {
		let {data: fetchedShopItem} = await axios.get(`${website}/api/shop/${item.type}/${item.id}`);
		console.log(fetchedShopItem);
		let newPokemonId = fetchedShopItem.retItem.id;
		await axios.get(`${website}/api/newPokemon/${newPokemonId}/5`)
		.then( response => {
			addPokemon(response.data);
		})
		.catch( error => {
			console.log(error)
		})
		handleClose();
	};


	useEffect(() => {
		setItem();
	}, []);

	return (
		<>
		{
			shopItem &&
			<Card className='shop-item'>
				<Card.Img className='shop-item-img' variant='top' src={itemImg}/>
				<div className="shop-item-name">{shopItem.name}</div>
				<Button 
					className="shop-item-purchase mt-auto mb-3"
					style={
						{
							border: 'None'
						}
					}
					onClick={handleShow}
				>
					{shopItem.cost}
				</Button>
			</Card>
		}
		{
			shopItem &&
			<Modal 
				show={show} 
				onHide={handleClose}
			>
			<Modal.Header closeButton>
				<Modal.Title>Do you want to purchase {shopItem.name}?</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				
			</Modal.Body>
			<Modal.Footer 
				style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
				<Button variant="primary" onClick={purchase} 
				style={
					{
					}
				}>
					Yes
				</Button>
				<Button variant="primary" onClick={handleClose}>
					No
				</Button>
			</Modal.Footer>
			</Modal>
		}
		</>
	)
}

export default ShopItem;