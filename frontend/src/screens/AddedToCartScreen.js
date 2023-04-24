import { useEffect, useState } from 'react';

import ConfettiExplosion from 'react-confetti-explosion';

import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductInCart } from '../features/cartSlice';

// icon
import { AiFillCheckCircle } from 'react-icons/ai';

// compoenets
import Btn from '../components/Btn';
import Loader from '../components/Loader';

const AddedToCartScreen = () => {
	const { id } = useParams();
	let location = useLocation();
	const navigate = useNavigate();

	const qty = location.search ? Number(location.search.split('=')[1]) : 1;

	const dispatch = useDispatch();

	const cart = useSelector(state => state.cart);
	const { cartItems } = cart;

	let subtotal = 0;
	cartItems.forEach(item => {
		let sub = item.qty * item.price;
		subtotal += sub;
	});

	const currentItem = cartItems.find(item => item._id === id);

	const addToCartHandler = () => {
		navigate(`/cart`);
	};

	console.log(currentItem);

	useEffect(() => {
		dispatch(fetchProductInCart({ id, qty }));
	}, [dispatch, id, qty]);

	return (
		<div className='added-screen'>
			{!currentItem ? (
				<div className='content'>
					<Loader />
				</div>
			) : (
				<div className='content added-screen__content'>
					<ConfettiExplosion
						particleCount={250}
						force={0.8}
						duration={3000}
						width={3000}
					/>

					<div className='added-screen__added'>
						<div className='added-screen__contain'>
							<div className='added-screen__image'>
								<img
									src={`http://localhost:5000/images/${currentItem.image}`}
									alt={currentItem.name}
								/>
							</div>
							<div className='cart-screen__info'>
								<h2 className='added-screen__heading'>
									<span className='added-screen__check'>
										<AiFillCheckCircle />
									</span>
									<span>Added to Cart</span>
								</h2>
								<span>Name: {currentItem.name}</span>
								<span>Author: {currentItem.author}</span>
								<span>Quantity: {currentItem.qty}</span>
							</div>
						</div>
					</div>

					<table className='added-screen__details'>
						<tbody>
							<tr>
								<td>Cart Subtotal</td>
								<td>${subtotal.toFixed(2)}</td>
							</tr>
							<tr>
								<td colSpan='2'>
									<Btn utility='with-full'>Proceed to checkout</Btn>
								</td>
							</tr>
							<tr>
								<td colSpan='2'>
									<Btn utility='with-full' cartHandler={addToCartHandler}>
										Go to Cartt
									</Btn>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AddedToCartScreen;
