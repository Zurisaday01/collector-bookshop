import React from 'react';

import { CategoryCard } from './CategoryCard';

const Categories = () => {
	const info = [
		'Fantasy',
		'Fiction',
		'Romance',
		'Mystery',
		'Thriller',
		'Non-fiction',
	];

	return (
		<div className='container categories'>
			<h2>Categories</h2>
			<div className='categories__main'>
				{info.map((category, i) => (
					<CategoryCard key={i} name={category} />
				))}
			</div>
		</div>
	);
};

export default Categories;
