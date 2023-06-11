import React from 'react';

// success, fail
const Alert = ({ children, type, screen, showAlert }) => {
	return (
		<div
			className={`${!showAlert ? 'alert--hide' : ''}  alert alert--${type} ${
				screen ? `alert--${screen}` : ''
			}`}>
			{children}
		</div>
	);
};

export default Alert;
