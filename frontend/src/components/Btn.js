import React from 'react';

const Btn = ({ children, handler, utility, disabled, type }) => {
	return (
		<button
			onClick={() => (handler ? handler() : false)}
			className={`btn ${utility} ${disabled ? 'btn--block' : ''}`}
			disabled={disabled}
			type={type ? type : 'button'}>
			{children}
		</button>
	);
};

export default Btn;
