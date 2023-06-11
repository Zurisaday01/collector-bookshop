import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import PuffLoader from 'react-spinners/PuffLoader';
import { orderPayReset } from '../features/orderSlice';
import { cartReset } from '../features/cartSlice';
import useMediaQuery from '../hooks/useMediaQuery';

const override = {
	display: 'block',
	margin: '0 auto',
	borderColor: 'black',
};

const DropdownUser = ({
	updating,
	name,
	photo,
	role,
	isPhotoUpdated,
	setIsPhotoUpdated,
	setIsMobile,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userPhoto, setUserPhoto] = useState('');
	const { currentUser } = useSelector(state => state.user);

	const isMobile = useMediaQuery('(max-width: 740px)');

	useEffect(() => {
		const getProfile = async () => {
			try {
				if (isPhotoUpdated) {
					const { data } = await axios.get('/api/users/yourProfile', {
						withCredentials: true,
					});

					setUserPhoto(data.data.user.photo);

					setIsPhotoUpdated(false);
				}
			} catch (error) {
				console.log(error);
			}
		};

		getProfile();
	}, [isPhotoUpdated, setIsPhotoUpdated]);

	const logoutUser = async () => {
		try {
			const res = await axios.get('/api/users/logout', {
				withCredentials: true,
			});

			// user log out
			dispatch(logout());
			// order log out - reset
			dispatch(orderPayReset());
			// cart log out - reset
			dispatch(cartReset());
			// log in again
			navigate('/signin');
		} catch (error) {
			console.log('error', error);
		}
	};

	return (
		<div
			className={`dropdown-user ${isMobile ? 'dropdown-user--mobile' : ''} ${
				currentUser.role === 'admin' ? 'dropdown-user--admin' : ''
			}`}>
			{/* onClick={() => setIsMobile(false)} */}
			{role !== 'admin' ? (
				<Link to='/profile'>
					<div className='dropdown-user__photo dropdown-user__photo--shadow'>
						{!updating ? (
							<img
								src={`/images/${isPhotoUpdated ? userPhoto : photo}`}
								alt={name}></img>
						) : (
							<PuffLoader
								color={'black'}
								loading={updating}
								cssOverride={override}
								size='100%'
								aria-label='Loading Spinner'
								data-testid='loader'
							/>
						)}
					</div>
					{isMobile && (
						<div>
							<span className='dropdown-user__name'>{name}</span>
						</div>
					)}
				</Link>
			) : (
				<div className='dropdown-user__photo dropdown-user__photo--shadow'>
					<img
						src={`/images/${isPhotoUpdated ? userPhoto : photo}`}
						alt={name}></img>
				</div>
			)}

			{!isMobile && (
				<div className='dropdown-user__content'>
					{role !== 'admin' ? (
						<Link to='/profile'>
							<div className='dropdown-user__user dropdown-user__option'>
								<div className='dropdown-user__photo dropdown-user__photo--option'>
									<img
										src={`/images/${isPhotoUpdated ? userPhoto : photo}`}
										alt={name}></img>
								</div>
								<span>{name}</span>
							</div>
						</Link>
					) : null}
					<button
						onClick={logoutUser}
						className='dropdown-user__option dropdown-user__option--logout'>
						Log Out
					</button>
				</div>
			)}
		</div>
	);
};

export default DropdownUser;

/*
cart.shipping address log out problem
*/
