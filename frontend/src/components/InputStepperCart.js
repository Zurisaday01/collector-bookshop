import { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { fetchProductInCart } from '../features/cartSlice';
import { removeFromCart } from '../features/cartSlice';

const InputStepperCart = ({ value, id }) => {
	const min = 1;
	const max = 100;

	const dispatch = useDispatch();
	
	const [qty, changeQty] = useState(value);

	

	const incrementValue = () => {
		if (qty < max) {
			changeQty(qty + 1);
		}
		return;
	};

	const decrementValue = () => {
		if (qty > min) {
			changeQty(qty - 1);
		}

		if (qty <= 1) {
			dispatch(removeFromCart(id));
		}
		return;
	};

	useEffect(() => {
		dispatch(fetchProductInCart({ id, qty }));
	}, [dispatch, id, qty]);

	return (
		<div className='input-stepper'>
			<button id='decrement' onClick={() => decrementValue()}>
				-
			</button>
			<input
				className='input-stepper__input'
				type='number'
				value={qty}
				readOnly></input>
			<button id='increment' onClick={() => incrementValue()}>
				+
			</button>
		</div>
	);
};

export default InputStepperCart;
