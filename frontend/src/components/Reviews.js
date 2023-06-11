import { useState } from 'react';
import { useSelector } from 'react-redux';
import Review from './Review';
import { Link } from 'react-router-dom';
import Message from '../components/Message';

const Reviews = ({ productId }) => {
	const {
		product: { data: product },
	} = useSelector(state => state.productDetails);

	const { currentUser } = useSelector(state => state.user);

	const [selectedStars, setSelectedStars] = useState();

	const filteredByStars = product.product.reviews.filter(
		review => Math.floor(review.rating) === Number(selectedStars)
	);

	return (
		<div className='reviews'>
			<div className='reviews__options'>
				<div className='reviews__select-wrapper'>
					<label htmlFor='stars'>Filter by:</label>

					<select
						className='reviews__select'
						onChange={e => setSelectedStars(e.target.value)}
						name='stars'
						id='stars'>
						<option value='All'>All stars</option>
						<option value='5'>5 stars</option>
						<option value='4'>4 stars</option>
						<option value='3'>3 stars</option>
						<option value='2'>2 stars</option>
						<option value='1'>1 star</option>
					</select>
				</div>
				<div className='reviews__customer'>
					<h2 className='heading-tertiary'>Review this product</h2>
					<p>What do you think of this product?</p>
					{currentUser &&
					!product.product.reviews.find(
						review => review.user._id === currentUser._id
					) ? (
						<Link
							to={`/product/${productId}/createReview`}
							className='btn width-full'>
							Write a customer review
						</Link>
					) : !currentUser ? (
						<Link to='/signin' className='u-text-decoration-none'>
							<Message variant='primary'>
								Sign in/sign up to write a review
							</Message>
						</Link>
					) : (
						currentUser &&
						product.product.reviews.find(
							review => review.user._id === currentUser._id
						) && (
							<Message variant='primary'>
								You have already posted a review
							</Message>
						)
					)}
				</div>
			</div>
			<div className='reviews__main'>
				<h3 className='heading-tertiary'>Customer reviews</h3>
				<span>{product.product.reviewsQuantity} reviews</span>
				<div className='reviews__container'>
					{product.product.reviews ? (
						filteredByStars && filteredByStars.length > 0 ? (
							filteredByStars.map(review => (
								<Review
									key={review._id}
									review={review}
									isCurrentUser={
										currentUser ? review.user._id === currentUser._id : false
									}
								/>
							))
						) : !selectedStars || selectedStars === 'All' ? (
							product.product.reviews.map(review => (
								<Review
									key={review._id}
									review={review}
									isCurrentUser={
										currentUser ? review.user._id === currentUser._id : false
									}
								/>
							))
						) : (
							filteredByStars.length === 0 && (
								<Message variant='primary'>No reviews</Message>
							)
						)
					) : (
						<p>No reviews</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default Reviews;
