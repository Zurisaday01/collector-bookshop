import React, { useEffect } from 'react';
import Btn from '../components/Btn';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderSumary } from '../features/cartSlice';
import {
	orderStart,
	orderSuccess,
	orderFailure,
	orderReset,
} from '../features/orderSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useMediaQuery from '../hooks/useMediaQuery';

const PlaceOrderScreen = () => {
	const cart = useSelector(state => state.cart);
	const { order, success } = useSelector(state => state.orderCreate);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isMobile = useMediaQuery('(max-width: 600px)');

	// total price of all the items
	const totalItems = cart.cartItems
		.reduce((acc, item) => acc + item.price * item.qty, 0)
		.toFixed(2);

	// if total is grather than 100 the shipping is free
	const shippingPrice = totalItems > 100 ? 0 : 100;

	const taxPrice = Number((0.15 * totalItems).toFixed(2));

	const totalPrice = Number(
		Number(totalItems) + Number(shippingPrice) + Number(taxPrice)
	).toFixed(2);

	const { address, city, postalCode, country } = cart.shippingAddress;

	useEffect(() => {
		dispatch(
			getOrderSumary({ totalItems, shippingPrice, taxPrice, totalPrice })
		);
	}, [dispatch, totalItems, shippingPrice, taxPrice, totalPrice]);

	useEffect(() => {
		if (success) {
			navigate(`/order/${order._id}`);
			dispatch(orderReset());
		}
	}, [navigate, success, dispatch]);

	const createOrder = async (
		orderItems,
		shippingAddress,
		paymentMethod,
		shippingPrice,
		taxPrice,
		totalPrice
	) => {
		try {
			const { data } = await axios.post(
				'/api/orders',
				{
					orderItems: orderItems,
					shippingAddress: shippingAddress,
					paymentMethod: paymentMethod,
					shippingPrice: shippingPrice,
					taxPrice: taxPrice,
					totalPrice: totalPrice,
				},
				{
					withCredentials: true,
				}
			);

			dispatch(orderSuccess(data.data.order));
		} catch (error) {
			dispatch(orderFailure());
			console.log(error);
		}
	};

	const handlerCheckout = () => {
		//start the order
		dispatch(orderStart());

		// send data to order
		createOrder(
			cart.cartItems,
			cart.shippingAddress,
			cart.paymentMethod,
			cart.order.shippingPrice,
			cart.order.taxPrice,
			cart.order.totalPrice
		);
	};

	return (
		<div className='order-screen'>
			<div className='order-screen__container'>
				<div className='order-screen__main'>
					<div className='order-screen__info-card'>
						<h2>Shipping</h2>
						<p>
							Address: {address}, {city}, {postalCode}, {country}
						</p>
					</div>
					<div className='order-screen__info-card'>
						<h2>Payment Method</h2>
						<p>Method: {cart.paymentMethod}</p>
					</div>
					<div className='order-screen__info-card'>
						<h2>Order Items</h2>

						{isMobile ? (
							<div>
								{cart.cartItems.map(item => (
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
											<span className='u-mt-small'>Price: ${item.price}</span>
											<span>Quantity: ${item.qty}</span>
											<span>
												Subtotal: ${(item.qty * item.price).toFixed(2)}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<table className='order-screen__table'>
								<tbody>
									<tr className='cart-screen__headings'>
										<th>Book</th>
										<th>Price</th>
										<th>Quantity</th>
										<th>Subtotal</th>
										<th></th>
									</tr>
									{cart.cartItems ? (
										cart.cartItems.map(item => (
											<tr key={item._id} className='cart-screen__rows'>
												<td className='cart-screen__book-info'>
													<div className='cart-screen__img'>
														<img
															src={`/images/${item.image}`}
															alt={item.name}
														/>
													</div>
													<div className='cart-screen__info'>
														<span>{item.name}</span>
														<span className='cart-screen__author'>
															{item.author}
														</span>
													</div>
												</td>
												<td>${item.price}</td>
												<td>{item.qty}</td>

												<td>${(item.qty * item.price).toFixed(2)}</td>
											</tr>
										))
									) : (
										<span>Loading...</span>
									)}
								</tbody>
							</table>
						)}
					</div>
				</div>
				<div className='order-screen__summary'>
					<h2 className='heading-tertiary'>Order Summary</h2>

					<table className='cart-screen__details'>
						{cart.order ? (
							<tbody>
								<tr>
									<td>Subtotal</td>
									<td>${cart.order.totalItems}</td>
								</tr>
								<tr>
									<td>Shipping</td>
									<td>${cart.order.shippingPrice}</td>
								</tr>
								<tr>
									<td>Tax</td>
									<td>${cart.order.taxPrice}</td>
								</tr>
								<tr>
									<td>Total</td>
									<td>${cart.order.totalPrice}</td>
								</tr>

								<tr>
									<td colSpan='2'>
										<Btn handler={handlerCheckout} utility='width-full'>
											Proceed to checkout
										</Btn>
									</td>
								</tr>
							</tbody>
						) : null}
					</table>
				</div>
			</div>
		</div>
	);
};

export default PlaceOrderScreen;
