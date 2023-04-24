import { useEffect, useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';

// components
import CardBook from '../components/CardBook';
import SidebarCategories from '../components/SidebarCategories';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ShopScreen = () => {
	const dispatch = useDispatch();
	const productList = useSelector(state => state.productList);

	console.log(productList);
	const {
		products: { products },
		isLoading,
		hasError,
	} = productList;

	const [selectedCategory, setSelectedCategory] = useState();

	let filteredProducts = [];
	if (!selectedCategory) {
		console.log('All products');
	} else {
		filteredProducts = products.filter(item =>
			item.category.includes(selectedCategory)
		);
	}

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	return (
		<div className='shop-screen'>
			<div className='shop-screen__container'>
				<SidebarCategories getCategory={setSelectedCategory} />

				<div
					className={`shop-screen__books ${
						products
							? filteredProducts.length !== 0 ||
							  !selectedCategory ||
							  selectedCategory === 'All books'
								? 'shop-screen--products'
								: 'shop-screen--noproducts'
							: ''
					}`}>
					{isLoading ? (
						<Loader />
					) : // <h2>Loading...</h2>
					hasError ? (
						<Message variant='alert'>Something went wrong</Message>
					) : products ? (
						!selectedCategory || selectedCategory === 'All books' ? (
							products.map(
								// eslint-disable-next-line no-unused-expressions
								product => <CardBook key={product._id} product={product} />
							)
						) : products.filter(item =>
								item.category.includes(selectedCategory)
						  ).length === 0 ? (
							<Message variant='primary'>
								There are no books of this category
							</Message>
						) : (
							products
								.filter(item => item.category.includes(selectedCategory))
								.map(
									// eslint-disable-next-line no-unused-expressions
									product => <CardBook key={product._id} product={product} />
								)
						)
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ShopScreen;
