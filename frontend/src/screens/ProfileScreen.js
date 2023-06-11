import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Options
import ManageProfile from '../components/ManageProfile';
import ManagePhoto from '../components/ManagePhoto';
import ManageAccount from '../components/ManageAccount';
import ManageMyOrders from '../components/ManageMyOrders';
import Alert from '../components/Alert';
import PuffLoader from 'react-spinners/PuffLoader';
import CustomPopup from '../components/CustomPopup';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const override = {
	display: 'block',
	margin: '0 auto',
	borderColor: 'black',
};

const ProfileScreen = ({ isPhotoUpdated, setIsPhotoUpdated }) => {
	const user = useSelector(state => state.user);

	const [isProfileShown, setIsProfileShown] = useState(true);
	const [isPhotoShown, setIsPhotoShown] = useState(false);
	const [isAccountShown, setIsAccountShown] = useState(false);
	const [isMyOrders, setIsMyOrders] = useState(false);

	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [userPhoto, setUserPhoto] = useState('');

	const [visibility, setVisibility] = useState(false);

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
	}, [isPhotoUpdated]);

	const handleClickProfile = () => {
		setIsProfileShown(true);
		setIsPhotoShown(false);
		setIsAccountShown(false);
		setIsMyOrders(false);
	};

	const handleClickPhoto = () => {
		setIsProfileShown(false);
		setIsPhotoShown(true);
		setIsAccountShown(false);
		setIsMyOrders(false);
	};

	const handleClickAccount = () => {
		setIsProfileShown(false);
		setIsPhotoShown(false);
		setIsAccountShown(true);
		setIsMyOrders(false);
	};

	const handleClickMyOrders = () => {
		setIsProfileShown(false);
		setIsPhotoShown(false);
		setIsAccountShown(false);
		setIsMyOrders(true);
	};

	return (
		<div className='profile-screen'>
			<CustomPopup
				setVisibility={setVisibility}
				visibility={visibility}
				title='Delete account'>
				<p>
					¿Are you sure you want to delete your account? If so, select continue.
				</p>
			</CustomPopup>
			<div className='profile-screen__main'>
				<div className='profile-screen__info'>
					<div className='profile-screen__photo-box'>
						{!user.updating ? (
							<div className='profile-screen__photo'>
								{(userPhoto || user.currentUser.photo) && (
									<img
										src={`/images/${
											isPhotoUpdated ? userPhoto : user.currentUser.photo
										}`}
										alt={user.currentUser.name}></img>
								)}
							</div>
						) : (
							<div className='profile-screen__photo'>
								<PuffLoader
									color={'black'}
									loading={user.updating}
									cssOverride={override}
									size='100%'
									aria-label='Loading Spinner'
									data-testid='loader'
								/>
							</div>
						)}
						<button
							className='profile-screen__delete'
							onClick={e => setVisibility(!visibility)}>
							Delete Account
						</button>
					</div>

					<nav className='profile-screen__nav'>
						<ul className='profile-screen__options'>
							<li
								className={`profile-screen__option ${
									isProfileShown ? 'active-option' : ''
								}`}>
								<button onClick={handleClickProfile}>Profile</button>
							</li>
							<li
								className={`profile-screen__option ${
									isPhotoShown ? 'active-option' : ''
								}`}>
								<button onClick={handleClickPhoto}>Photo</button>
							</li>
							<li
								className={`profile-screen__option ${
									isAccountShown ? 'active-option' : ''
								}`}>
								<button onClick={handleClickAccount}>Account Security</button>
							</li>
							<li
								className={`profile-screen__option ${
									isMyOrders ? 'active-option' : ''
								}`}>
								<button onClick={handleClickMyOrders}>My Orders</button>
							</li>
						</ul>
					</nav>
				</div>
				<div className='profile-screen__manage'>
					<h1>Manage your profile</h1>
					<div className='profile-screen__container'>
						{isProfileShown ? (
							<ManageProfile setSuccess={setSuccess} setFailure={setFailure} />
						) : isPhotoShown ? (
							<ManagePhoto
								setSuccess={setSuccess}
								setFailure={setFailure}
								setIsPhotoUpdated={setIsPhotoUpdated}
							/>
						) : isAccountShown ? (
							<ManageAccount
								setSuccess={setSuccess}
								setNewMessage={setNewMessage}
								setFailure={setFailure}
							/>
						) : isMyOrders ? (
							<ManageMyOrders />
						) : null}
					</div>
				</div>

				{(success || failure) && <TopBarProgress />}

				<Alert type='success' screen='profile' showAlert={success}>
					Your changes have been successfully made 😎!
				</Alert>

				<Alert type='fail' screen='profile' showAlert={failure}>
					{newMessage ? (
						<span>{newMessage}</span>
					) : (
						<span>Something went wrong with your changes 🫤!</span>
					)}
				</Alert>
			</div>
		</div>
	);
};

export default ProfileScreen;
