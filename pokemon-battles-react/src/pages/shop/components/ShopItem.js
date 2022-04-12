import { useContext } from 'react';
import './ShopItem.css';
import { Card, Button, Col } from 'react-bootstrap';
import { ClientContext } from '../../../context/ClientContext';

const ShopItem = ({item}) => {

	const {setShopItem, setShopModal} = useContext(ClientContext);

	return (
		<>
		{item &&
			<Col md={6}>
				<Card className='shop-item'>
					<Card.Img className='shop-item-img' variant='top' 
					src={require(`../../../img/shopitems/${item.description}.png`)}/>
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
