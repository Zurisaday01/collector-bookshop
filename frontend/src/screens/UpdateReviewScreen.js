import { useEffect, useState } from 'react';
import Alert from '../components/Alert';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useNavigate, useParams } from 'react-router-dom';
import Btn from '../components/Btn';
import {
	editStart,
	editSuccess,
	editFailure,
	fetchReview,
} from '../features/reviewSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import axios from 'axios';

const UpdateReviewScreen = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);
	const [message, setMessage] = useState(false);
	const { review: reviewData, isLoading } = useSelector(
		state => state.reviewDetails
	);
	const { loading } = useSelector(state => state.reviewEdit);
	const [rating, setRating] = useState();
	const [review, setReview] = useState();

	useEffect(() => {
		dispatch(fetchReview(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (reviewData && reviewData.review) {
			setRating(reviewData.rating);
			setReview(reviewData.review.replaceAll('/n', '\n\n'));
		}
	}, [reviewData]);

	const handleSubmit = async e => {
		e.preventDefault();

		dispatch(editStart());

		try {
			const res = await axios.patch(
				`/api/reviews/${id}`,
				{
					rating: rating,
					review: review.replace(/\n\n/g, '/n'),
				},
				{
					withCredentials: true,
				}
			);
			dispatch(editSuccess());

			// refetch data
			dispatch(fetchReview(id));

			// send message
			setMessage('Successfully updated');

			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 3000);
		} catch (error) {
			dispatch(editFailure());

			// send message
			setMessage('Something went wrong while updating your review');

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
				{isLoading ? (
					<Loader />
				) : (
					<form className='review-screen__form' onSubmit={handleSubmit}>
						<fieldset>
							<legend className='heading-secondary'>Update Review</legend>
							<p className='form__group'>
								<label htmlFor='description'>Rating</label>
								<input
									type='number'
									min='1'
									max='5'
									step='.5'
									value={rating}
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
									value={review}
									onChange={e => setReview(e.target.value)}
									className='review-screen__comment'
									rows='4'
									cols='50'
									required
								/>
							</p>
							<p className='form__group form__group--mt u-align-start'>
								<Btn type='Submit' utility='width-full'>
									Update
								</Btn>
							</p>
						</fieldset>
					</form>
				)}
			</main>
		</section>
	);
};

export default UpdateReviewScreen;
