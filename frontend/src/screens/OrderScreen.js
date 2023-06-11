import React, { useEffect, useState } from 'react';
import {
	fetchOrder,
	orderPayUpdate,
	orderPayStart,
	orderPaySuccess,
	orderPayFailure,
	orderPayReset,
	loadingReset,
} from '../features/orderSlice';
import { cartClean } from '../features/cartSlice';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';
import axios from 'axios';

import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../components/Loader';

const OrderScreen = () => {
	const { id } = useParams();
	const orderDetails = useSelector(state => state.orderDetails);
	const cart = useSelector(state => state.cart);
	const user = useSelector(state => state.user);
	const dispatch = useDispatch();

	const { loading: loadingPay, success: successPay } = useSelector(
		state => state.orderPay
	);

	const [sdkReady, setSdkReady] = useState(false);

	useEffect(() => {
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal');
			// create an script
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};
			document.body.appendChild(script);
		};

		if (!orderDetails.order || orderDetails.order._id !== id) {
			// if the order is successfull then reset the state
			// NOT WORKING
			dispatch(fetchOrder(id));
		} else if (!orderDetails.order.isPaid) {
			if (!window.paypal) {
				loadingReset();
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [dispatch, id, successPay, orderDetails]);

	const successPaymentHandler = async paymentResult => {
		// starting payment
		dispatch(orderPayStart());

		try {
			const { data } = await axios.put(`/api/orders/${id}/pay`, paymentResult, {
				withCredentials: true,
			});
			dispatch(orderPaySuccess());
			dispatch(orderPayUpdate(data.data.order));
			// // if success pay then reset order
			// dispatch(orderPayReset());
			// // and clean the cart
			dispatch(cartClean());
		} catch (error) {
			dispatch(orderPayFailure());
			console.error(error);
		}
	};

	return (
		<div className='order-screen'>
			{loadingPay && !orderDetails.success ? (
				<div className='container'>
					<Loader />
				</div>
			) : (
				orderDetails.order &&
				orderDetails.success && (
					<div className='order-screen__container'>
						<div className='order-screen__main'>
							<h1 className='heading-secondary'>
								Order {orderDetails.order._id}
							</h1>

							<div className='order-screen__info-card'>
								<h2>Shipping</h2>
								<p>Name: {user.currentUser.name}</p>
								<p>Email: {user.currentUser.email}</p>
								{orderDetails.order.shippingAddress && (
									<p>
										Address: {orderDetails.order.shippingAddress.address},{' '}
										{orderDetails.order.shippingAddress.city},{' '}
										{orderDetails.order.shippingAddress.postalCode},{' '}
										{orderDetails.order.shippingAddress.country}
									</p>
								)}

								{orderDetails.order.isDelivered ? (
									<Message variant='success'>
										Delivered on {orderDetails.order.deliveredAt}
									</Message>
								) : (
									<Message variant='alert'>Not delivered</Message>
								)}
							</div>
							<div className='order-screen__info-card'>
								<h2>Payment Method</h2>
								<p>Method: {cart.paymentMethod}</p>
								{orderDetails.order.isPaid ? (
									<Message variant='success'>
										Paid on {orderDetails.order.paidAt}
									</Message>
								) : (
									<Message variant='alert'>Not paid</Message>
								)}
							</div>
							<div className='order-screen__info-card'>
								<h2>Order Items</h2>
								<table className='cart-screen__table'>
									<tbody>
										<tr className='cart-screen__headings'>
											<th>Book</th>
											<th>Price</th>
											<th>Quantity</th>
											<th>Subtotal</th>
											<th></th>
										</tr>
										{orderDetails.order.orderItems ? (
											orderDetails.order.orderItems.map(item => (
												<tr className='cart-screen__rows'>
													<td className='cart-screen__book-info'>
														<div className='cart-screen__img'>
															<img
																src={`/images/${item.image}`}
																alt={item.name}
															/>
														</div>
														<div className='cart-screen__info'>
															<span>{item.name}</span>
															{/* <span className='cart-screen__author'>
																{item.author}
															</span> */}
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
							</div>
						</div>
						<div className='order-screen__summary'>
							<h2 className='heading-tertiary'>Order Summary</h2>
							<table className='cart-screen__details'>
								{!orderDetails.order ||
								!Object.keys(orderDetails.order).length > 0 ? (
									<Loader />
								) : (
									<tbody>
										<tr>
											<td>Subtotal</td>
											<td>
												$
												{orderDetails.order.orderItems
													.reduce((acc, item) => item.qty * item.price + acc, 0)
													.toFixed(2)}
											</td>
										</tr>
										<tr>
											<td>Shipping</td>
											<td>${orderDetails.order.shippingPrice.toFixed(2)}</td>
										</tr>
										<tr>
											<td>Tax</td>
											<td>${orderDetails.order.taxPrice}</td>
										</tr>
										<tr>
											<td>Total</td>
											<td>${orderDetails.order.totalPrice}</td>
										</tr>

										{!orderDetails.order.isPaid && (
											<tr>
												<td colSpan='2'>
													{loadingPay && <Loader />}
													{!sdkReady ? (
														<Loader />
													) : (
														<PayPalButton
															amount={orderDetails.order.totalPrice}
															onSuccess={successPaymentHandler}
														/>
													)}
												</td>
											</tr>
										)}
									</tbody>
								)}
							</table>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default OrderScreen;
