import React from 'react';

import { BiBook } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export const CategoryCard = ({ name, getCategory }) => {
	const navigate = useNavigate();

	const handleOption = e => {
		getCategory(name);
		navigate('/shop');
	};

	return (
		<div className='card-category' onClick={handleOption}>
			<span className='card-category__icon'>
				<BiBook />
			</span>
			<h3 className='card-category__name'>{name}</h3>
			<span className='card-category__action'>Shop Now</span>
		</div>
	);
};
