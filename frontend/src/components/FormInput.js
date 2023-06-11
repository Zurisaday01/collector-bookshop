import { useState } from 'react';

const FormInput = ({ label, onChange, ...inputProps }) => {
	const [focused, setFocused] = useState(false);
	const handleFocus = e => {
		setFocused(true);
	};

	return (
		<p className='form-input'>
			<label htmlFor={inputProps.name}>{label}</label>
			<input
				{...inputProps}
				className='form-input__input'
				onChange={onChange}
				onBlur={handleFocus}
				onFocus={() =>
					inputProps.name === 'passwordConfirm' && setFocused(true)
				}
				focused={focused.toString()}
				autoComplete='off'
			/>
		</p>
	);
};

export default FormInput;
