import { useContext } from 'react';
import './ShopItem.css';
import { Card, Button, Col } from 'react-bootstrap';
import { ClientContext } from '../../../context/ClientContext';
import coin from '../../../img/items/coin.png'

const ShopItem = ({item}) => {

	// global variables from shop.js parent component 
	// to set item to purchase and to pass modal data
	const {setShopItem, setShopModal} = useContext(ClientContext);

	return (
		<>
		{item &&
			<Col xs={12} md={6}>
				<Card className='shop-item'>
					{/* shop item image */}
					<Card.Img className='shop-item-img' variant='top' 
						src={require(`../../../img/shopitems/${item.description}.png`)}
					/>
					<div className="shop-item-name">{item.name}</div>
					<Button 
						className="mt-auto mb-3"
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
						<img src={coin} alt="coin" className='coin me-1' /> {item.cost} 
					</Button>
				</Card>
			</Col>
		}
		</>
	)
}

export default ShopItem;
