import { useEffect, useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';

// components
import CardBook from '../components/CardBook';
import SidebarCategories from '../components/SidebarCategories';
import Message from '../components/Message';
import Loader from '../components/Loader';
import SearchInput from '../components/SearchInput';

const ShopScreen = ({
	categoriesOptions,
	selectedCategory,
	setSelectedCategory,
}) => {
	const dispatch = useDispatch();
	const { products, isLoading, hasError } = useSelector(
		state => state.productList
	);

	const [search, setSearch] = useState('');

	let filteredProducts = [];
	if (selectedCategory && products) {
		filteredProducts = products.filter(item =>
			item.category.includes(selectedCategory)
		);
	}

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const productsSearchedByName = products.filter(product =>
		product.name.toLowerCase().includes(search.toLowerCase().trim())
	);

	return (
		<div className='shop-screen'>
			<div className='shop-screen__container'>
				<div>
					<SidebarCategories
						categoriesOptions={categoriesOptions}
						getCategory={setSelectedCategory}
						setSearch={setSearch}
					/>
					<SearchInput search={search} setSearch={setSearch} />
				</div>
				{!search ? (
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
						) : hasError ? (
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
				) : (
					<div
						className={`shop-screen__books ${
							productsSearchedByName.length !== 0
								? 'shop-screen--products'
								: 'shop-screen--noproducts'
						}`}>
						{productsSearchedByName.length === 0 ? (
							<Message variant='primary'>No results</Message>
						) : (
							productsSearchedByName.map(
								// eslint-disable-next-line no-unused-expressions
								product => <CardBook key={product._id} product={product} />
							)
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ShopScreen;
