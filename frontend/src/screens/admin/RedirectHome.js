import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectHome = ({ isAdmin, children }) => {
	const user = useSelector(state => state.user);
	if (user.currentUser?.role === 'admin') {
		return <Navigate to='/admin' replace />;
	}
	return children;
};
export default RedirectHome;
