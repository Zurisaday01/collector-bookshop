import React from 'react';
import { Link } from 'react-router-dom';

// components
import Hero1 from '../assets/img/hero-1.png';
import Hero2 from '../assets/img/hero-2.png';
import Hero3 from '../assets/img/hero-3.png';

const Hero = ({ setSelectedCategory }) => {
	return (
		<div className='hero container'>
			<div className='hero__main'>
				<span className='min-heading'>Welcome to this bookstore</span>
				<h1 className='heading-primary'>Find your books here</h1>
				<Link
					className='btn'
					to='/shop'
					onClick={() => setSelectedCategory('All books')}>
					Shop Now
				</Link>
			</div>
			<div className='collection'>
				<img
					src={Hero1}
					className='collection__img collection__img--1'
					alt='a light in the flame'
				/>
				<img
					src={Hero2}
					className='collection__img collection__img--2'
					alt='finlay donovan'
				/>
				<img
					src={Hero3}
					className='collection__img collection__img--3'
					alt='the house in the sea'
				/>
			</div>
		</div>
	);
};

export default Hero;
