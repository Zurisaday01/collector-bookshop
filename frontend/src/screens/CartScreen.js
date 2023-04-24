import { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductInCart } from '../features/cartSlice';

// reducer action
import { removeFromCart } from '../features/cartSlice';

// icon
import { AiFillDelete } from 'react-icons/ai';

// components
import InputStepperCart from '../components/InputStepperCart';
import Btn from '../components/Btn';
import Message from '../components/Message';

const CartScreen = () => {
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

	useEffect(() => {
		dispatch(fetchProductInCart({ id, qty }));
	}, [dispatch, id, qty]);

	// return (
	// 	<button className='quick' onClick={() => dispatch(reset())}>
	// 		Reset
	// 	</button>
	// );

	return (
		<div className='cart-screen'>
			<div className='content cart-screen__content'>
				<div className='cart-screen__main'>
					{cartItems.length === 0 ? (
						<Message variant='primary'>The cart is empty</Message>
					) : (
						<div>
							<h2>
								Shoping Cart:{' '}
								{cartItems.reduce((acc, item) => acc + item.qty, 0)} books
							</h2>
							<table className='cart-screen__table'>
								<tbody>
									<tr className='cart-screen__headings'>
										<th>Book</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Subtotal</th>
										<th></th>
									</tr>
									{cartItems.map(item => (
										<tr key={item._id} className='cart-screen__rows'>
											<td className='cart-screen__book-info'>
												<div className='cart-screen__img'>
													<img
														src={`http://localhost:5000/images/${item.image}`}
														alt={item.name}
													/>
												</div>
												<div className='cart-screen__info'>
													<span
														className='cart-screen__name'
														onClick={() => navigate(`/product/${item._id}`)}>
														{item.name}
													</span>
													<span className='cart-screen__author'>
														{item.author}
													</span>
												</div>
											</td>
											<td>${item.price}</td>
											<td className='cart-screen__stepper'>
												<InputStepperCart value={item.qty} id={item._id} />
											</td>
											<td>${(item.qty * item.price).toFixed(2)}</td>
											<td>
												<button
													className='cart-screen__delete'
													onClick={() => dispatch(removeFromCart(item._id))}>
													<AiFillDelete />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				<table className='cart-screen__details'>
					<tbody>
						<tr>
							<td>Subtotal</td>
							<td>${subtotal.toFixed(2)}</td>
						</tr>

						<tr>
							<td colSpan='2'>
								<Btn utility='with-full'>Proceed to checkout</Btn>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CartScreen;
