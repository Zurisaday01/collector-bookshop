import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Btn from './Btn';
import axios from 'axios';
import {
	deleteAccuntStart,
	deleteAccuntFailure,
	logout,
} from '../features/userSlice';
import { orderPayReset } from '../features/orderSlice';
import { cartReset } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';
import Message from './Message';

// Because this is the only popup in the app, I'll put the logic to delete the user in here
const CustomPopup = ({ setVisibility, visibility, title, children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isFailure, setIsFailure] = useState(false);

	const handleDelete = async () => {
		dispatch(deleteAccuntStart());
		try {
			const res = await axios.delete('/api/users/deleteProfile', {
				withCredentials: true,
			});

			// if it is suceesful then logout
			dispatch(logout());
			// order log out - reset
			dispatch(orderPayReset());
			// cart log out - reset
			dispatch(cartReset());
			// log in again
			navigate('/signin');
		} catch (error) {
			dispatch(deleteAccuntFailure());

			console.log(error);
			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	return (
		<div className={`popup ${visibility ? 'popup--show' : 'popup--hidden'}`}>
			<div className='popup__main'>
				{isFailure && (
					<Message variant='alert'>
						Something went wrong, try again later.
					</Message>
				)}
				<h2>{title}</h2>
				<div className='u-mb-small'>{children}</div>
				<div className='popup__actions'>
					<Btn handler={() => setVisibility(false)}>Close</Btn>
					<Btn handler={handleDelete}>Continue</Btn>
				</div>
			</div>
		</div>
	);
};

export default CustomPopup;
