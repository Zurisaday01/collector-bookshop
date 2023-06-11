import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useMediaQuery from '../../hooks/useMediaQuery';
import { fetchOrder } from '../../features/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import {
	orderDeliverStart,
	orderDeliverSuccess,
	orderDeliverFailure,
	orderDeliverUpdate,
	orderDeliverReset,
} from '../../features/orderSlice';
import Btn from '../../components/Btn';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import Message from '../../components/Message';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const OrderItems = () => {
	const { id } = useParams();
	const isMobile = useMediaQuery('(max-width: 600px)');
	const dispatch = useDispatch();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const { isLoading, order } = useSelector(state => state.orderDetails);

	const { loading, success: successDeliver } = useSelector(
		state => state.orderDeliver
	);

	const [success, setSuccess] = useState(false);

	const successDeliverHandler = async () => {
		// starting payment
		dispatch(orderDeliverStart());

		try {
			const { data } = await axios.patch(
				`/api/orders/${id}/deliver`,
				{
					isDelivered: true,
					deliveredAt: Date.now(),
				},
				{
					withCredentials: true,
				}
			);
			dispatch(orderDeliverSuccess());
			setSuccess(true);
			dispatch(orderDeliverSuccess());

			// re-fetch order
			dispatch(fetchOrder(id));

			dispatch(orderDeliverUpdate(data.data.order));
			// if success deliver then reset order
			dispatch(orderDeliverReset());

			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 3000);
		} catch (error) {
			dispatch(orderDeliverFailure());
			console.error(error);

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	useEffect(() => {
		if (!order || (order && id !== order._id)) {
			dispatch(fetchOrder(id));
		}
	}, [dispatch, id]);

	return (
		<div className='order-screen order-screen--items'>
			{loading && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully delivered
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while trying to process the delivery
			</Alert>
			<div className='order-screen__back'>
				<Link className='btn' to='/admin/orders'>
					Back
				</Link>
			</div>

			{isLoading || loading || !order ? (
				<Loader />
			) : (
				order &&
				order.orderItems && (
					<div className='order-screen__container'>
						<div className='order-screen__main'>
							{!order.isPaid && (
								<div className='u-mb-small'>
									<Message variant='primary'>
										Waiting for the customer to paid
									</Message>
								</div>
							)}
							{order.shippingAddress && (
								<div className='order-screen__info-card'>
									<h2>Shipping</h2>
									<p>
										Address: {order.shippingAddress.address},{' '}
										{order.shippingAddress.city},{' '}
										{order.shippingAddress.postalCode},{' '}
										{order.shippingAddress.country}
									</p>
								</div>
							)}
							{order.isPaid && (
								<div className='order-screen__info-card'>
									<h2>Paid Date</h2>
									<p>{order.paidAt.substring(0, 10)}</p>
								</div>
							)}
							{order.isDelivered && (
								<div className='order-screen__info-card'>
									<h2>Delivered Date</h2>
									<p>{order.deliveredAt.substring(0, 10)}</p>
								</div>
							)}

							<div className='order-screen__info-card'>
								<h2>Order Items</h2>

								{isMobile ? (
									<div>
										{order.cartItems.map(item => (
											<div key={item._id} className='cart-screen__mobile'>
												<div className='cart-screen__img'>
													<img src={`/images/${item.image}`} alt={item.name} />
												</div>

												<div className='cart-screen__info'>
													<span>{item.name}</span>
													<span className='cart-screen__author'>
														{item.author}
													</span>
													<span className='u-mt-small'>
														Price: ${item.price}
													</span>
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
											{order.orderItems ? (
												order.orderItems.map(item => (
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
								<tbody>
									<tr>
										<td>Subtotal</td>
										<td>
											$
											{order.orderItems
												.reduce((acc, item) => acc + item.price * item.qty, 0)
												.toFixed(2)}
										</td>
									</tr>
									<tr>
										<td>Shipping</td>
										<td>${order.shippingPrice}</td>
									</tr>
									<tr>
										<td>Tax</td>
										<td>${order.taxPrice}</td>
									</tr>
									<tr>
										<td>Total</td>
										<td>${order.totalPrice}</td>
									</tr>

									<tr>
										{order.isPaid && (
											<td colSpan='2'>
												{success || order.isDelivered ? (
													<span className='order-screen__success'>
														<AiOutlineCheckCircle />
													</span>
												) : (
													<Btn
														handler={successDeliverHandler}
														utility='width-full'>
														Deliver
													</Btn>
												)}
											</td>
										)}
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default OrderItems;
