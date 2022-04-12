import { useState, useEffect, useContext } from 'react';
import { Link, renderMatches, useNavigate } from 'react-router-dom'
import './ShopItem.css';
import { Card, Button, Modal } from 'react-bootstrap';
import axios from "axios";
import { ClientContext } from '../../../context/ClientContext';
import { addPokemon, addToWallet } from '../../../util/users/Users';

// Firebase
import { auth } from '../../../util/Firebase'
import { getUser } from '../../../util/users/Users';

const ShopItem = ({item}) => {

	const {website} = useContext(ClientContext);
	// set shop item
	const [shopItem, setShopItem] = useState();
	const [itemImg, setImage] = useState(null);

	// handle modal 
	const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	// user auth
	let navigate = useNavigate();
	const [user, setUser] = useState();
  const userInfo = async (uid) => {
    const info = await getUser(uid);
    setUser(info);
	}

	const setItem = async () => {
		if (item.type === 'mystery-egg') {
			const response = await import(`../../../img/eggs/${item.description}.png`);
			setImage(response.default);
		}
		setShopItem(item);
	};

	const setUserInfo = () => {
		if (auth.currentUser) {
			userInfo(auth.currentUser.uid);
		} else {
			navigate('/')
		}
	}

	const purchase = async () => {
		
		if (user.wallet < shopItem.cost) {
			alert("Balance Insufficient, Go Battle")
		} else {
			// obtain weighted random pokemon id
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
			// update balance after purchase
			await addToWallet(-1 * (shopItem.cost));
			setUserInfo();
		}
		handleClose();
		navigate('/')
	};

	// generate pop up showing obtained pokemon
	const showPokemon = async (pokemonId) => {
		let {data: pokemondata} = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
		let imgsrc = pokemondata.sprites.other.dream_world.front_default;
		return (<><Modal><Modal.Img src={imgsrc}></Modal.Img></Modal></>)
	}

	useEffect(() => {
		setItem();
		setUserInfo();
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
			shopItem && user &&
			<Modal 
				show={show} 
				onHide={handleClose}
			>
			<Modal.Header closeButton>
				<Modal.Title>Current Balance: {user.wallet} coins</Modal.Title>
			</Modal.Header>
				<Modal.Body>
					Do you wish to purchase 
					<strong> {shopItem.name} </strong> 
					for {shopItem.cost} {shopItem.currency}s?
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