import { useEffect } from 'react';
import { fetchOrders } from '../features/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';

import { GrFormClose } from 'react-icons/gr';
import Btn from './Btn';
import { useNavigate } from 'react-router-dom';
import Message from './Message';

const ManageMyOrders = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		orders,
		isLoading: loading,
		hasError: error,
	} = useSelector(state => state.orderList);

	useEffect(() => {
		dispatch(fetchOrders());
	}, [dispatch]);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				orders &&
				(orders.length === 0 ? (
					<Message variant='primary'>
						You haven't ordered anything yet...
					</Message>
				) : (
					<div className='profile-screen__wrapper'>
						<table className='profile-screen__table'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Date</th>
									<th>Total</th>
									<th>Paid</th>
									<th>Delivered</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{orders.map(order => (
									<tr key={order._id}>
										<td>{order._id}</td>
										<td>{order.createAt.substring(0, 10)}</td>
										<td>${order.totalPrice}</td>
										<td>
											{order.isPaid ? (
												order.paidAt.substring(0, 10)
											) : (
												<span>
													<GrFormClose />
												</span>
											)}
										</td>
										<td>
											{order.isDelivered ? (
												order.deliveredAt.substring(0, 10)
											) : (
												<span>
													<GrFormClose />
												</span>
											)}
										</td>
										<td>
											<Btn
												handler={() => navigate(`/order/${order._id}`)}
												utility='width-full'>
												Details
											</Btn>{' '}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))
			)}
		</>
	);
};

export default ManageMyOrders;
