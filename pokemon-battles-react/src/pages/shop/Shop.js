import './Shop.css';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Row, Modal, Button } from 'react-bootstrap';
import ShopItem from './components/ShopItem';
import { ClientContext } from '../../context/ClientContext';
import Back from '../../components/Back'

// Firebase
import { getUser, addPokemon, addToWallet } from '../../util/users/Users'
import { auth } from '../../util/Firebase'
import Navbar from '../../components/Navbar';



const Shop = () => {
	const [shopItems, setShopItems] = useState(); 
	const [animatePokemon, setAnimatePokemon] = useState(false)
	const [newPokemon, setNewPokemon] = useState()

	const {website, setLoading, shopModal, setShopModal, setShopItem, shopItem, user, setUser} = useContext(ClientContext)

	let navigate = useNavigate()


	const getShopItems = async () => {
		await axios.get(`${website}/api/shop/mystery-egg`)
		.then( res => {
			setShopItems(res.data)
		})
		.catch((error) => {
			console.log(error)
		})
	}

	const userInfo = async (uid) => {
    	const info = await getUser(uid);
    	setUser(info);
	}


	const setUserInfo = () => {
		if (auth.currentUser) {
			userInfo(auth.currentUser.uid);
		} else {
			navigate('/')
		}
	}

	const doPokemonAnimate = async (pokemon) => {
		// Do animation
		setAnimatePokemon(true)

		// hide modal after animation
		setTimeout(() => {
			setAnimatePokemon(false)
			setShopModal(false)
		}, 2000);
	}

	const purchase = async (item) => {
		
		if (user.wallet < shopItem.cost) {
			alert("Balance Insufficient, Go Battle")
		} else {
			// obtain weighted random pokemon id
			let {data: fetchedShopItem} = await axios.get(`${website}/api/shop/${item.type}/${item.id}`);
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
			userInfo(auth.currentUser.uid)
		}
		doPokemonAnimate(newPokemonId)
	};

	useEffect( () => {
		setUserInfo()
		getShopItems();
		setLoading(false)
  	}, []);



	return (
		<div id="shop" className="content">
			<Back name="Back" to="/welcome" />

			<div className="content-item">
			<Navbar />

				<h3>Shop</h3>
				<Row id='shop-row'>
					{
						shopItems && shopItems.map((item) => {
							return(<ShopItem className="itemCard" item={item}/>)
						})
					}
				</Row>

				{user && shopItem &&
					<Modal 
						show={shopModal} 
						onHide={()=>{setShopModal(false)}}
					>
					<Modal.Header closeButton>
						<Modal.Title>Current Balance: {user.wallet} coins</Modal.Title>
					</Modal.Header>
						<Modal.Body>
							Do you wish to purchase 
							<strong> {shopItem.name} </strong> 
							for {shopItem.cost} {shopItem.currency}s?
							{/* Animation of pokemon */}
							{animatePokemon && newPokemon &&
								<div className='new-pokemon'>
									<img src={require("../../img/pokemon/" + myPokemon[selectedPokemon].identifier  + ".png")} alt={myPokemon[selectedPokemon].identifier}/>
								</div>
							}
						</Modal.Body>
						<Modal.Footer 
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<Button variant="primary" onClick={()=>{purchase(shopItem)}}>
								Yes
							</Button>
							<Button variant="primary" onClick={()=>{setShopModal(false)}}>
								No
							</Button>
						</Modal.Footer>
					</Modal>
				}
			</div>
		</div>
	)
}

export default Shop;
