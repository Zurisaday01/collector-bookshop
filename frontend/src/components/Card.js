import { Link } from 'react-router-dom';

const Card = ({ product }) => {
	return (
		<div className='swiper-slide card'>
			<Link to={`/product/${product._id}`}>
				<div className='card__container'>
					{product.bestseller ? (
						<span className='card__bestseller'>Best Seller</span>
					) : null}
					<div className='card__img'>
						<img src={`/images/${product.image}`} alt={product.name} />
					</div>

					<div className='card__content'>
						<span className='card__title'>{product.name}</span>
						<span className='card__author'>{product.author}</span>
						<span className='card__price'>${product.price}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default Card;
