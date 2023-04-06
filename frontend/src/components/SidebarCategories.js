import React from 'react';

const SidebarCategories = ({ getCategory }) => {
	const categories = [
		'All books',
		'Fantasy',
		'Fiction',
		'Romance',
		'Mystery',
		'Thriller',
		'Contemporary',
		'Historical Fiction',
		'Sports',
		'Non-fiction',
	];

	const handlerOption = e => {
		getCategory(e.target.textContent);
	};

	return (
		<aside className='sidebar-categories'>
			<h3>Categories</h3>
			<div className='sidebar-categories__container'>
				{categories.map((category, idx) => (
					<span
						className='sidebar-categories__option'
						key={idx}
						onClick={handlerOption}>
						{category}
					</span>
				))}
			</div>
		</aside>
	);
};

export default SidebarCategories;
