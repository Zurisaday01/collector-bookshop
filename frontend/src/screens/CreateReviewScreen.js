import React, { useState } from 'react';
import Btn from '../components/Btn';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
	createStart,
	createSuccess,
	createFailure,
} from '../features/reviewSlice';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const CreateReviewScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { productId } = useParams();

	const [rating, setRating] = useState();
	const [review, setReview] = useState();
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const { loading } = useSelector(state => state.createReview);

	const [message, setMessage] = useState();

	const handleSubmit = async e => {
		e.preventDefault();

		dispatch(createStart());

		try {
			const res = await axios.post(
				'/api/reviews',
				{
					product: productId,
					rating: rating,
					review: review.replace(/\n\n/g, '/n'),
				},
				{
					withCredentials: true,
				}
			);
			dispatch(createSuccess());

			setMessage('Your review was posted');

			// clean inputs

			e.target.reset();

			setIsSuccess(true);

			const panout = new Promise((resolve, reject) =>
				setTimeout(() =>
					setTimeout(() => {
						setIsSuccess(false);
						resolve();
					}, 3000)
				)
			);

			const redirection = new Promise((resolve, reject) =>
				setTimeout(() =>
					setTimeout(() => {
						navigate(-1);
						resolve();
					}, 3000)
				)
			);

			Promise.all([panout, redirection]);
		} catch (error) {
			dispatch(createFailure());

			setMessage(error.response.data.message);
			// clean inputs
			e.target.reset();

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};
	return (
		<section className='review-screen container'>
			<div>
				<Btn handler={() => navigate(-1)}>Go Back</Btn>
			</div>
			{loading && <TopBarProgress />}
			<Alert
				type={(isSuccess && 'success') || (isFailure && 'fail')}
				screen='user'
				showAlert={(isSuccess && isSuccess) || (isFailure && isFailure)}>
				{message}
			</Alert>

			<main>
				<form className='review-screen__form' onSubmit={handleSubmit}>
					<fieldset>
						<legend className='heading-secondary'>Create a Review</legend>
						<p className='form__group'>
							<label htmlFor='description'>Rating</label>
							<input
								type='number'
								min='1'
								max='5'
								step='.5'
								onChange={e => setRating(e.target.value)}
								className='form-input__input'
								required
							/>
						</p>
						<p className='form__group'>
							<label htmlFor='description'>Your Review</label>
							<textarea
								name='description'
								id='description'
								onChange={e => setReview(e.target.value)}
								className='review-screen__comment'
								rows='4'
								cols='50'
								required
							/>
						</p>
						<p className='form__group form__group--mt u-align-start'>
							<Btn type='Submit' utility='width-full'>
								Post
							</Btn>
						</p>
					</fieldset>
				</form>
			</main>
		</section>
	);
};

export default CreateReviewScreen;
