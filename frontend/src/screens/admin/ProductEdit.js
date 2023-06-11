import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Btn from '../../components/Btn';
import {
	editStart,
	editSuccess,
	editFailure,
	productReset,
	fetchProduct,
} from '../../features/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const ProductEdit = () => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const { id } = useParams();
	const dispatch = useDispatch();
	const {
		product: { data },
		isLoading: loading,
		success,
	} = useSelector(state => state.productDetails);

	useEffect(() => {
		if (!data?.product || (data?.product && id !== data.product._id)) {
			dispatch(fetchProduct(id));
		}
	}, [dispatch, id, success]);

	const [name, setName] = useState('');
	const [newImage, setNewImage] = useState();
	const [author, setAuthor] = useState();
	const [category, setCategory] = useState();
	const [price, setPrice] = useState();
	const [countInStock, setCountInStock] = useState();
	const [description, setDescription] = useState();
	const [check, setCheck] = useState(false);

	useEffect(() => {
		if (data) {
			setName(data.product.name);
			setAuthor(data.product.author);
			setCategory(data.product.category.join(', '));
			setPrice(data.product.price);
			setCountInStock(data.product.countInStock);
			setDescription(data.product.description.replaceAll('/n', '\n\n'));
			setCheck(data.product.bestseller);
		}
	}, [data]);

	const handleSubmit = async e => {
		e.preventDefault();

		dispatch(editStart());

		// creating form data to sent
		const formData = new FormData();

		formData.append('name', name);
		if (newImage) {
			formData.append('image', newImage);
		}
		formData.append('author', author);
		formData.append('category', JSON.stringify(category.split(', ')));
		formData.append('price', Number(price).toFixed(2));
		formData.append('countInStock', Number(countInStock));
		formData.append('description', description.replace(/\n\n/g, '/n'));
		formData.append('bestseller', check);

		try {
			const res = await axios.patch(`/api/products/${id}`, formData, {
				withCredentials: true,
			});
			dispatch(editSuccess());

			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 3000);
		} catch (error) {
			dispatch(editFailure());

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};
	return (
		<div className='product-edit'>
			{loading && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully edited
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while editing the product
			</Alert>

			<div className='product-edit__top'>
				<Link
					className='btn'
					to='/admin/products'
					onClick={() => dispatch(productReset())}>
					Back
				</Link>
			</div>

			<main>
				{loading && !success ? (
					<Loader />
				) : (
					data?.product && (
						<form className='form u-no-border' onSubmit={handleSubmit}>
							<fieldset>
								<legend className='heading-secondary'>Edit Product</legend>
								<p className='form__group'>
									<label htmlFor='name'>Name</label>
									<input
										type='text'
										name='name'
										value={name}
										id='name'
										autoComplete='off'
										onChange={e => setName(e.target.value)}
										className='form__input'
										required
									/>
								</p>
								<p className='form__group'>
									<label htmlFor='file'>Current Image</label>
									<div className='product-edit__image'>
										<img
											src={`/images/${data.product.image}`}
											alt={data.product.image}
										/>
									</div>
								</p>
								<p className='form__group'>
									<label htmlFor='file'>New Image</label>
									<input
										type='file'
										name='file'
										id='file'
										autoComplete='off'
										onChange={e => setNewImage(e.target.files[0])}
										className='form__input'
									/>
								</p>
								<p className='form__group'>
									<label htmlFor='author'>Author</label>
									<input
										type='text'
										name='author'
										value={author}
										id='author'
										autoComplete='off'
										onChange={e => setAuthor(e.target.value)}
										className='form__input'
										required
									/>
								</p>

								<p className='form__group'>
									<label htmlFor='category'>Category</label>
									<input
										type='text'
										name='category'
										value={category}
										id='category'
										autoComplete='off'
										onChange={e => setCategory(e.target.value)}
										className='form__input'
										required
									/>
								</p>
								<p className='form__group'>
									<label htmlFor='price'>Price</label>
									<input
										type='number'
										name='price'
										value={price}
										id='price'
										autoComplete='off'
										onChange={e => setPrice(e.target.value)}
										className='form__input'
										required
									/>
								</p>
								<p className='form__group'>
									<label htmlFor='stock'>Count in stock</label>
									<input
										type='number'
										name='stock'
										value={countInStock}
										id='stock'
										autoComplete='off'
										onChange={e => setCountInStock(e.target.value)}
										className='form__input'
										required
									/>
								</p>
								<p className='form__group'>
									<label htmlFor='description'>Description</label>
									<textarea
										name='description'
										id='description'
										value={description}
										onChange={e => setDescription(e.target.value)}
										className='form__input'
										rows='4'
										cols='50'
										required
									/>
								</p>
								<p className='form__group form__group--check'>
									<label htmlFor='bestseller'>Is it bestseller?</label>
									<input
										type='checkbox'
										name='bestseller'
										value={check}
										id='bestseller'
										className='form__input'
										checked={check}
										onChange={e => setCheck(e.target.checked)}
									/>
								</p>

								<p className='form__group form__group--mt'>
									<Btn type='Submit' utility='width-full'>
										Update
									</Btn>
								</p>
							</fieldset>
						</form>
					)
				)}
			</main>
		</div>
	);
};

export default ProductEdit;
