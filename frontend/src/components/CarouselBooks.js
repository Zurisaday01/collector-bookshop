import { useEffect } from 'react';
import React from 'react';

// import Swiper core and required modules
import {
	Navigation,
	Pagination,
	Scrollbar,
	A11y,
	EffectCoverflow,
	EffectCards,
	Zoom,
} from 'swiper';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';

// components
import Card from './Card';
import Loader from '../components/Loader';
import Message from '../components/Message';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const CarouselBooks = () => {
	const dispatch = useDispatch();
	const { products, isLoading, hasError } = useSelector(
		state => state.productList
	);

	let bestsellerProducts = [];
	for (const key in products) {
		if (products[key]['bestseller'] === true) {
			bestsellerProducts.push(products[key]);
		}
	}

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	return (
		<section className='carousel'>
			<div className='container-carousel'>
				{isLoading ? (
					<Loader />
				) : hasError ? (
					<Message variant='alert'>Something went wrong</Message>
				) : (
					<Swiper
						// install Swiper modules
						modules={[
							Navigation,
							Pagination,
							Scrollbar,
							A11y,
							EffectCoverflow,
							EffectCards,
							Zoom,
						]}
						slidesPerView={4}
						breakpoints={{
							300: {
								slidesPerView: 1,
							},
							550: {
								slidesPerView: 2,
							},
							880: {
								slidesPerView: 3,
							},
							1200: {
								slidesPerView: 4,
							},
						}}
						navigation
						pagination={{ clickable: true }}
						scrollbar={{ draggable: true }}>
						{bestsellerProducts.map(product => (
							<SwiperSlide key={product._id}>
								<Card product={product} />
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>
		</section>
	);
};

export default CarouselBooks;
