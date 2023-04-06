import React from 'react';

// components
import Hero from '../components/Hero';
import CarouselBooks from '../components/CarouselBooks';
import Categories from '../components/Categories';

const HomeScreen = () => {
	return (
		<div className='home-screen'>
			<Hero />
			<Categories />
			<div className='container home__title'>
				<h2 className='home-screen__title'>Bestselling Books</h2>
			</div>
			<CarouselBooks />
		</div>
	);
};

export default HomeScreen;
