import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loader from '../../components/Loader';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { fetchAllOrders } from '../../features/orderSlice';

import { GrFormClose } from 'react-icons/gr';

import { Link } from 'react-router-dom';

const theme = createTheme({
	typography: {
		fontSize: 20,
	},
});

const OrdersList = () => {
	const { orders, isLoading: loading } = useSelector(
		state => state.ordersAllList
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllOrders());
	}, [dispatch]);

	return (
		<div className='orders-list'>
			<div className='orders-list__top'>
				<h2 className='heading-secondar'>Orders</h2>
			</div>
			<main>
				{loading ? (
					<Loader />
				) : (
					orders && (
						<ThemeProvider theme={theme}>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label='simple table'>
									<TableHead>
										<TableRow>
											<TableCell>ID</TableCell>
											<TableCell>Username</TableCell>
											<TableCell>Payment Method</TableCell>
											<TableCell>Address</TableCell>
											<TableCell>City</TableCell>
											<TableCell>Country</TableCell>
											<TableCell>Postal Code</TableCell>
											<TableCell>Total</TableCell>
											<TableCell>Date</TableCell>
											<TableCell>Paid</TableCell>
											<TableCell>Delivered</TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orders.map(order => (
											<TableRow
												key={order._id}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 },
												}}>
												<TableCell>{order._id}</TableCell>
												<TableCell>
													{order.user ? order.user?.name : 'User deleted'}
												</TableCell>
												<TableCell>{order.paymentMethod}</TableCell>
												<TableCell>{order.shippingAddress.address}</TableCell>
												<TableCell>{order.shippingAddress.city}</TableCell>
												<TableCell>{order.shippingAddress.country}</TableCell>
												<TableCell>
													{order.shippingAddress.postalCode}
												</TableCell>
												<TableCell>${order.totalPrice}</TableCell>
												<TableCell>{order.createAt.substring(0, 10)}</TableCell>
												<TableCell>
													{order.isPaid ? (
														order.paidAt.substring(0, 10)
													) : (
														<span>
															<GrFormClose />
														</span>
													)}
												</TableCell>
												<TableCell>
													{order.isDelivered ? (
														order.deliveredAt.substring(0, 10)
													) : (
														<span>
															<GrFormClose />
														</span>
													)}
												</TableCell>

												<TableCell className='admin__cell admin__cell--order'>
													<Link
														to={`/admin/orders/order/${order._id}`}
														className='admin__action admin__action--outline u-margin-left-none'>
														Deliver
													</Link>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</ThemeProvider>
					)
				)}
			</main>
		</div>
	);
};

export default OrdersList;
