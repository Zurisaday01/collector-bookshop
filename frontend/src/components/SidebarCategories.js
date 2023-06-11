import React from 'react';

const SidebarCategories = ({ categoriesOptions, getCategory, setSearch }) => {
	const handleOption = e => {
		getCategory(e.target.textContent);
		setSearch('');
	};

	return (
		<aside className='sidebar-categories'>
			<h3>Categories</h3>
			<div className='sidebar-categories__container'>
				{categoriesOptions.map((category, idx) => (
					<span
						className='sidebar-categories__option'
						key={idx}
						onClick={handleOption}>
						{category}
					</span>
				))}
			</div>
		</aside>
	);
};

export default SidebarCategories;
