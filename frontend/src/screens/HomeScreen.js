import React from 'react';

// components
import Hero from '../components/Hero';
import CarouselBooks from '../components/CarouselBooks';
import Categories from '../components/Categories';

const HomeScreen = ({ categoriesOptions, setSelectedCategory }) => {
	return (
		<div className='home-screen'>
			<Hero getCategory={setSelectedCategory} />
			<Categories
				categoriesOptions={categoriesOptions}
				getCategory={setSelectedCategory}
			/>
			<div className='home__title container'>
				<h2 className='home-screen__title heading-secondary'>
					Bestselling Books
				</h2>
			</div>
			<CarouselBooks />
		</div>
	);
};

export default HomeScreen;
