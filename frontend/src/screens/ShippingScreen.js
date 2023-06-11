import React, { useState } from 'react';
import Btn from '../components/Btn';
import { getShippingAddress } from '../features/cartSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ShippingScreen = () => {
	const dispatch = useDispatch();
	const cart = useSelector(state => state.cart);
	const navigate = useNavigate();

	const [address, setAdress] = useState(
		cart.shippingAddress ? cart.shippingAddress.address : ''
	);
	const [city, setCity] = useState(
		cart.shippingAddress ? cart.shippingAddress.city : ''
	);
	const [postalCode, setPostalCode] = useState(
		cart.shippingAddress ? cart.shippingAddress.postalCode : ''
	);
	const [country, setCountry] = useState(
		cart.shippingAddress ? cart.shippingAddress.country : ''
	);

	const handleSubmit = e => {
		e.preventDefault();
		// send shippingAddress to cart
		dispatch(getShippingAddress({ address, city, postalCode, country }));
		// go to payment screen
		navigate('/payment');
	};

	return (
		<div className='shipping-screen'>
			<form onSubmit={handleSubmit} className='form'>
				<fieldset>
					<legend className='heading-secondary'>Shipping</legend>

					<p className='form__group'>
						<label htmlFor='address'>Address</label>
						<input
							type='text'
							name='address'
							id='address'
							onChange={e => setAdress(e.target.value)}
							value={address}
							className='form__input'
							required
						/>
					</p>
					<p className='form__group'>
						<label htmlFor='address'>City</label>
						<input
							type='text'
							name='address'
							id='address'
							onChange={e => setCity(e.target.value)}
							value={city}
							className='form__input'
							required
						/>
					</p>
					<p className='form__group'>
						<label htmlFor='address'>Postal Code</label>
						<input
							type='text'
							name='address'
							id='address'
							onChange={e => setPostalCode(e.target.value)}
							value={postalCode}
							className='form__input'
							required
						/>
					</p>
					<p className='form__group'>
						<label htmlFor='address'>Country</label>
						<input
							type='text'
							name='address'
							id='address'
							onChange={e => setCountry(e.target.value)}
							value={country}
							className='form__input'
							required
						/>
					</p>

					<p className='form__group form__group--mt u-align-start'>
						<Btn type='Submit'>Continue</Btn>
					</p>
				</fieldset>
			</form>
		</div>
	);
};

export default ShippingScreen;
