import React from 'react';
import { getPaymentMethod } from '../features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import Btn from '../components/Btn';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const cart = useSelector(state => state.cart);

	const [payment, setPayment] = useState(
		cart.paymentMethod ? cart.shippingAddress.payment : ''
	);

	const handleSubmit = e => {
		e.preventDefault();
		// send shippingAddress to cart
		dispatch(getPaymentMethod(payment));
		// go to placeorder screen
		navigate('/placeorder');
	};

	return (
		<div className='payment-screen'>
			<form onSubmit={handleSubmit} className='form'>
				<fieldset>
					<legend className='heading-secondary'>Payment Method</legend>

					<p className='form__group u-flex-row'>
						<input
							type='checkbox'
							name='payment'
							id='payment'
							onChange={e => setPayment(e.target.value)}
							value='PayPal'
							className='form__input'
							required
						/>
						<label htmlFor='payment'>PayPal or Credit Card</label>
					</p>

					<p className='form__group form__group--mt u-align-start'>
						<Btn type='Submit'>Continue</Btn>
					</p>
				</fieldset>
			</form>
		</div>
	);
};

export default PaymentScreen;
