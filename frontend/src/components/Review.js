import React from 'react';

import { MdModeEditOutline } from 'react-icons/md';

import Rating from './Rating';
import { Link } from 'react-router-dom';

const Review = ({ review, isCurrentUser }) => {
	return (
		<div className='review'>
			<div className='review__top'>
				<div className='review__photo'>
					{review.user ? (
						<img
							src={`/images/${review.user.photo}`}
							alt={review.user.name}></img>
					) : (
						<img src={`/images/default.png`} alt='Deleted user'></img>
					)}
				</div>
				<div className='review__info'>
					{review.user ? <h4>{review.user.name}</h4> : <h4>Deleted User</h4>}
					<Rating ratingsAverage={review.rating} />
				</div>
			</div>

			<div>
				{review.review.split('/n').map((data, index) => (
					<p className='review__paragraph paragraph' key={index}>
						{data}
					</p>
				))}
			</div>
			{isCurrentUser && (
				<div className='review__actions'>
					<Link
						className='review__action u-text-decoration-none'
						to={`/review/${review._id}`}>
						<MdModeEditOutline />
						Edit
					</Link>
				</div>
			)}
		</div>
	);
};

export default Review;
