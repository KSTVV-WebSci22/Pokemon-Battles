import { useState, useEffect, useRef } from 'react';
import './Shop.css';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import ShopItem from './components/ShopItem';


const Shop = () => {
	let [items, setItems] = useState();

	// get all first gen pokemons total 150?
	const getStorePokemons = async () => {
		await axios.get("https://pokeapi.co/api/v2/generation/1/")
            .then((res) => {
				let items = shuffle(res.data.pokemon_species);
                setItems(items);
            })
            .catch((error) => {
                console.log(error);
            })
	};

	// get random numbers by shuffling array
	// https://stackoverflow.com/questions/18806210/generating-non-repeating-random-numbers-in-js
	function shuffle(array) {
		var i = array.length,
			j = 0,
			temp;
	
		while (i--) {

			j = Math.floor(Math.random() * (i+1));
			// swap randomly chosen element with current element
			temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	useEffect( () => {
		getStorePokemons();
    }, []);


	return (
		<>
		{ items &&
			<div id="shop" className="full-screen">
				<h3>Shop</h3>
				<div id='shop-container'>
					<Row md={2} id='shop-row' className='row-cols-2'>
						{
							items.map((item) => (
								<div>
									<ShopItem className="itemCard" itemUrl={item.url}/>
								</div>
							))
						}
					</Row>
				</div>
			</div>
		}
		</>
	);

}

export default Shop;
