import React from 'react';
import { Link } from 'react-router-dom';

const CardBook = ({ product }) => {
	return (
		<div className='card'>
			<Link to={`/product/${product._id}`}>
				<div className='card__container card-book__container'>
					{product.bestseller ? (
						<span className='card__bestseller'>Best Seller</span>
					) : null}
					<div className='card__img'>
						<img src={`/images/${product.image}`} alt={product.name} />
					</div>

					<div className='card__content'>
						<h3 className='card__title'>{product.name}</h3>
						<span className='card__author'>{product.author}</span>
						<span className='card__price'>${product.price}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CardBook;
