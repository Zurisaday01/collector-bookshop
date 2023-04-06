import React from 'react';

import { BiBook } from 'react-icons/bi';

export const CategoryCard = ({ name }) => {
	return (
		<div className='card-category'>
			<span className='card-category__icon'>
				<BiBook />
			</span>
			<h3 className='card-category__name'>{name}</h3>
			<span className='card-category__action'>Shop Now</span>
		</div>
	);
};
