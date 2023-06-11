import { useEffect } from 'react';
import CardStats from './CardStats';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/userSlice';
import { fetchAllOrders } from '../../features/orderSlice';
import { fetchProducts } from '../../features/productSlice';
import Loader from '../../components/Loader';

const Dashboard = () => {
	const { users, isLoading: loadingUsers } = useSelector(
		state => state.usersList
	);
	const { products, isLoading: loadingProducts } = useSelector(
		state => state.productList
	);
	const { orders, isLoading: loadingOrders } = useSelector(
		state => state.ordersAllList
	);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchAllOrders());
	}, [dispatch]);

	return (
		<div className='dashboard'>
			{loadingUsers && loadingProducts && loadingOrders ? (
				<Loader />
			) : (
				<div className='dashboard__top'>
					<CardStats title='Users' stats={users.length} iconname='users' />
					<CardStats
						title='Products'
						stats={products.length}
						iconname='products'
					/>
					<CardStats title='Orders' stats={orders.length} iconname='orders' />
					<CardStats
						title='Earnings'
						stats={`$${orders
							.reduce((acc, order) => acc + order.totalPrice, 0)
							.toFixed(2)}`}
						iconname='earnings'
					/>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
