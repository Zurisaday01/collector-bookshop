import React from 'react';

const Btn = ({ children, cartHandler, utility, disabled, type }) => {
	return (
		<button
			onClick={() => (cartHandler ? cartHandler() : false)}
			className={`btn ${utility} ${disabled ? 'btn--block' : ''}`}
			disabled={disabled}
			type={type ? type : 'button'}>
			{children}
		</button>
	);
};

export default Btn;
