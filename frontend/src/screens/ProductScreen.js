import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProduct } from '../features/productSlice';

// components
import Btn from '../components/Btn';
import Message from '../components/Message';
import Loader from '../components/Loader';
import InputStepper from '../components/InputStepper';
import Rating from '../components/Rating';

const ProductScreen = () => {
	const [qty, setQty] = useState(1);

	const { id } = useParams();
	const dispatch = useDispatch();
	const productDetails = useSelector(state => state.productDetails);
	const { product, isLoading, hasError } = productDetails;

	useEffect(() => {
		dispatch(fetchProduct(id));
	}, [dispatch, id]);

	const chageQty = value => {
		setQty(value);
	};

	const navigate = useNavigate();

	const addToCartHandler = () => {
		navigate(`/cart/${id}?qty=${qty}`);
	};

	return (
		<div className='product-screen'>
			<div className='container'>
				<Link className='btn' to='/shop'>
					Go Back
				</Link>
				{isLoading ? (
					<div className='product-screen__loader'>
						<Loader />
					</div>
				) : hasError ? (
					<Message variant='alert'> Something went wrong</Message>
				) : product.status === 'success' ? (
					<div>
						<div className='product-screen__content'>
							<div className='product-screen__left'>
								<div className='product-screen__image'>
									<img
										src={`http://localhost:5000/images/${product.data.product.image}`}
										alt={product.data.product.name}></img>
								</div>

								<div className='product-screen__details'>
									{product.data.product.countInStock !== 0 ? (
										<span className='product-screen__availability'>
											In Stock
										</span>
									) : (
										<span className='product-screen__availability'>
											Unavailable
										</span>
									)}

									<table>
										<tbody>
											<tr>
												<td>Price</td>
												<td>${product.data.product.price}</td>
											</tr>

											{product.data.product.countInStock !== 0 ? (
												<tr>
													<td>Quantity</td>
													<td className='product-screen__input'>
														<InputStepper value={qty} changeQty={chageQty} />
													</td>
												</tr>
											) : null}

											<tr>
												<td colSpan='2'>
													<Btn
														cartHandler={addToCartHandler}
														utility='with-full'
														disabled={product.data.product.countInStock === 0}>
														Add to cart
													</Btn>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div className='product-screen__info'>
								<div className='product-screen__heading'>
									<h2 className='heading-secondary'>
										{product.data.product.name}
									</h2>
									<span className='product-screen__author'>
										By {product.data.product.author}
									</span>
									<div className='product-screen__stars'>
										<Rating
											ratingsAverage={product.data.product.ratingsAverage}
										/>
									</div>
									<span className='product-screen__price'>
										${product.data.product.price}
									</span>
								</div>
								<div className='product-screen__description'>
									{product.data.product.description
										.split('/n')
										.map((e, index) => (
											<p className='product-screen__paragraph' key={index}>
												{e}
											</p>
										))}
								</div>
								<div className='product-screen__genres'>
									Genres
									{product.data.product.category.map((e, index) => (
										<span key={index}>{e}</span>
									))}
								</div>
							</div>
						</div>

						<div className='product-screen__reviews'>
							<h2>Customer reviews</h2>

							{product.data.product.reviews.map(review => {
								<div>
									<p>This is a review</p>;
								</div>;
							})}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ProductScreen;
