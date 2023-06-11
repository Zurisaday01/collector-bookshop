import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Btn from '../../components/Btn';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
	addStart,
	addSuccess,
	addFailure,
} from '../../features/productSlice.js';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const ProductAdd = () => {
	const dispatch = useDispatch();
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const [name, setName] = useState();
	const [author, setAuthor] = useState();
	const [category, setCategory] = useState();
	const [price, setPrice] = useState();
	const [countInStock, setCountInStock] = useState();
	const [description, setDescription] = useState();
	const [check, setCheck] = useState(false);

	const { loading } = useSelector(state => state.productAdd);

	const handleSubmit = async e => {
		e.preventDefault();

		dispatch(addStart());

		try {
			const res = await axios.post(
				'/api/products',
				{
					name: name,
					author: author,
					category: JSON.stringify(category.split(', ')),
					price: Number(price).toFixed(2),
					countInStock: Number(countInStock),
					description: description.replace(/\n\n/g, '/n'),
					bestseller: check,
				},
				{
					withCredentials: true,
				}
			);
			dispatch(addSuccess());

			// clean inputs
			e.target.reset();

			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 3000);
		} catch (error) {
			dispatch(addFailure());

			// clean inputs
			e.target.reset();

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};
	return (
		<div className='product-add'>
			{loading && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully added
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while adding the product
			</Alert>
			<div className='product-edit__top'>
				<Link className='btn' to='/admin/products'>
					Back
				</Link>
			</div>

			<main>
				<form className='form u-no-border' onSubmit={handleSubmit}>
					<fieldset>
						<legend className='heading-secondary'>Add Product</legend>
						<p className='form__group'>
							<label htmlFor='name'>Name</label>
							<input
								type='text'
								name='name'
								id='name'
								autoComplete='off'
								onChange={e => setName(e.target.value)}
								className='form__input'
								required
							/>
						</p>

						<p className='form__group'>
							<label htmlFor='author'>Author</label>
							<input
								type='text'
								name='author'
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
								type='text'
								name='price'
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
								id='bestseller'
								className='form__input'
								checked={check}
								onChange={e => setCheck(e.target.checked)}
							/>
						</p>

						<p className='form__group form__group--mt'>
							<Btn type='Submit' utility='width-full'>
								Add
							</Btn>
						</p>
					</fieldset>
				</form>
			</main>
		</div>
	);
};

export default ProductAdd;
