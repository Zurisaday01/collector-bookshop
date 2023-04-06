import { useState } from 'react';

const InputStepper = ({ value, changeQty }) => {
	const min = 1;
	const max = 100;

	const incrementValue = () => {
		if (value < max) {
			changeQty(value + 1);
		}
		return;
	};

	const decrementValue = () => {
		if (value > min) {
			changeQty(value - 1);
		}
		return;
	};

	return (
		<div className='input-stepper'>
			<button id='decrement' onClick={() => decrementValue()}>
				-
			</button>
			<input
				className='input-stepper__input'
				type='number'
				value={value}
				readOnly></input>
			<button id='increment' onClick={() => incrementValue()}>
				+
			</button>
		</div>
	);
};

export default InputStepper;
