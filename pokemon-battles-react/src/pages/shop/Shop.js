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
	const [button, setButton] = useState(false)
	// use global variable in client context to 
	// shopModal <bool> : determines if modal pop-up is on display
	// shopItem: item return by api call axios.get(`${website}/api/shop/mystery-egg`)
	//           state set upon clicking cost button in ShopItem.js, 
	// 					 acts as global variable that passes information from 
	// 					 child component to parent. 
	// declared at App.js
	const {website, setLoading, shopModal, setShopModal, shopItem, user, setUser} = useContext(ClientContext)

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


	const setUserInfo = async () => {
		if (auth.currentUser) {
			userInfo(auth.currentUser.uid);
		} else {
			navigate('/')
		}
	}

	const doPokemonAnimate = async (pokemonName) => {

		setButton(false);
		setNewPokemon(pokemonName)
		setAnimatePokemon(true)
		// hide modal after animation
		setTimeout(() => {
			setShopModal(false)
			setAnimatePokemon(false)
			setButton(true);
		}, 2500);
	}

	const purchase = async (item) => {
		
		if (user.wallet < shopItem.cost) {
			alert("Balance Insufficient, Go Battle")
			navigate('/')
		} else {
			// obtain weighted random pokemon id
			let {data: chosenPokemon} = await axios.get(`${website}/api/shop/${item.type}/${item.id}`);
			let newPokemonId = chosenPokemon.retItem.id;
			await axios.get(`${website}/api/newPokemon/${newPokemonId}/5`)
			.then( response => {
				addPokemon(response.data);
			})
			.catch( error => {
				console.log(error)
			})
			// update balance after purchase
			await addToWallet(-1 * (shopItem.cost));
			await setUserInfo();
			await doPokemonAnimate(chosenPokemon.retItem.identifier);
		}
	};

	useEffect( () => {
		setUserInfo();
		getShopItems();
		setLoading(false);
		setButton(true)
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
				// Need both user and shopItem to be set
					<Modal 
						show={shopModal} 
						onHide={()=>{setShopModal(false)}}
						centered
					>
					<Modal.Header closeButton>
					<Modal.Title>Current Balance: {user.wallet} coins</Modal.Title>
					</Modal.Header>
						<Modal.Body style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
					  		}}>
							{/* Animation of pokemon */}
							{/* Hide text when animation shows */}
							{(animatePokemon && newPokemon) ?
								<div className='modal-images'>
									<img className='mystery-img' variant='top' 
										src={require(`../../img/shopitems/${shopItem.description}.png`)}/>
									<img className='new-pokemon-img' variant='top'
										src={require(`../../img/pokemon/${newPokemon}.png`)} alt={newPokemon}
										/>
								</div>
								:
								<div>
									Do you wish to purchase a
									<strong> {shopItem.name.toUpperCase()} </strong> 
									for {shopItem.cost} {shopItem.currency}s?
								</div>
							}
						</Modal.Body>
							{ 
							// hide buttons during animation
							button &&
								<Modal.Footer 
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}>
								
									<Button variant="primary" onClick={()=>{purchase(shopItem); }}>
										Yes
									</Button>
									<Button variant="primary" onClick={()=>{setShopModal(false)}}>
										No
									</Button>
								</Modal.Footer>
							}
					</Modal>
				}
			</div>
		</div>
	)
}

export default Shop;
