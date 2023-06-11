import { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductInCart } from '../features/cartSlice';

// custom hooks
import useMediaQuery from '../hooks/useMediaQuery';

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
	const dispatch = useDispatch();

	const qty = location.search ? Number(location.search.split('=')[1]) : 1;

	const cart = useSelector(state => state.cart);
	const user = useSelector(state => state.user);

	const { cartItems } = cart;

	const isMobile = useMediaQuery('(max-width: 600px)');

	let subtotal = 0;
	cartItems.forEach(item => {
		let sub = item.qty * item.price;
		subtotal += sub;
	});

	useEffect(() => {
		if (!cartItems.length === 0) {
			dispatch(fetchProductInCart({ id, qty }));
		}
	}, [dispatch, id, qty]);

	const onCheckout = () => {
		if (user.currentUser) navigate('/shipping');

		if (!user.currentUser) navigate('/signin');
	};

	return (
		<div className='cart-screen'>
			<div className='content cart-screen__content'>
				<div className='cart-screen__main'>
					<div>
						<h1 className='heading-secondary u-mb-s'>
							Shoping Cart: {cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
							books
						</h1>
						{cartItems.length === 0 ? (
							<Message variant='primary'>The cart is empty</Message>
						) : isMobile ? (
							<div>
								{cartItems.map(item => (
									<div key={item._id} className='cart-screen__mobile'>
										<div className='cart-screen__img'>
											<img src={`/images/${item.image}`} alt={item.name} />
										</div>

										<div className='cart-screen__info'>
											<span
												className='cart-screen__name'
												onClick={() => navigate(`/product/${item._id}`)}>
												{item.name}
											</span>
											<span className='cart-screen__author'>{item.author}</span>
											<span className='price'>${item.price}</span>
										</div>

										<div className='cart-screen__mobile-actions'>
											<div className='cart-screen__stepper'>
												<InputStepperCart value={item.qty} id={item._id} />
											</div>
											<button
												className='btn cart-screen__mobile-btn'
												onClick={() => dispatch(removeFromCart(item._id))}>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
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
													<img src={`/images/${item.image}`} alt={item.name} />
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
						)}
					</div>
				</div>

				<table className='cart-screen__details'>
					<tbody>
						<tr>
							<td>Subtotal</td>
							<td>${subtotal.toFixed(2)}</td>
						</tr>

						<tr>
							<td colSpan='2'>
								<Btn handler={onCheckout} utility='width-full'>
									Proceed to checkout
								</Btn>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CartScreen;
