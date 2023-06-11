import React from 'react';

import { CategoryCard } from './CategoryCard';

const Categories = ({ categoriesOptions, getCategory }) => {
	return (
		<div className='categories container'>
			<h2 className='heading-secondary'>Categories</h2>
			<div className='categories__main'>
				{categoriesOptions.map((category, i) => (
					<CategoryCard key={i} name={category} getCategory={getCategory} />
				))}
			</div>
		</div>
	);
};

export default Categories;
