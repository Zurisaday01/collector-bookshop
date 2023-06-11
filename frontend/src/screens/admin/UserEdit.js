import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Nav
import { Link, useParams } from 'react-router-dom';
import Btn from '../../components/Btn';
import {
	editStart,
	editSuccess,
	editFailure,
	userReset,
	fetchUser,
} from '../../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../../components/Loader';

import Alert from '../../components/Alert';
// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const UserEdit = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector(state => state.userAdminEdit);
	const { user, isLoading } = useSelector(state => state.userDetails);

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const { id } = useParams();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('user');

	useEffect(() => {
		dispatch(fetchUser(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setRole(user.role);
		}
	}, [user]);

	const handleSubmit = async e => {
		e.preventDefault();

		dispatch(editStart());

		try {
			const res = await axios.patch(
				`/api/users/${id}`,
				{
					name: name,
					email: email,
					role: role,
				},
				{
					withCredentials: true,
				}
			);
			dispatch(editSuccess());

			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 3000);
		} catch (error) {
			dispatch(editFailure());

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	return (
		<div className='user-edit'>
			{loading && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully edited
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while editing the user
			</Alert>
			<div className='user-edit__top'>
				<Link
					className='btn'
					to='/admin/users'
					onClick={() => dispatch(userReset())}>
					Back
				</Link>
			</div>

			<main>
				{isLoading && !user ? (
					<Loader />
				) : (
					<form className='form u-no-border' onSubmit={handleSubmit}>
						<fieldset>
							<legend className='heading-secondary'>Update User</legend>
							<p className='form__group'>
								<label htmlFor='name'>Name</label>
								<input
									type='text'
									name='name'
									id='name'
									autoComplete='off'
									value={name}
									onChange={e => setName(e.target.value)}
									placeholder='First and last name'
									className='form__input'
									required
								/>
							</p>
							<p className='form__group'>
								<label htmlFor='email'>Email</label>
								<input
									type='email'
									name='email'
									id='email'
									autoComplete='off'
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder='example@gmail.com'
									className='form__input'
									required
								/>
							</p>

							<p className='form__group'>
								<label htmlFor='role'>Role</label>

								<select
									onChange={e => setRole(e.target.value)}
									name='role'
									id='role'
									className='form__input'>
									<option
										value='user'
										selected={role === 'user' ? true : false}>
										User
									</option>
									<option
										value='admin'
										selected={role === 'admin' ? true : false}>
										Admin
									</option>
								</select>
							</p>
							<p className='form__group form__group--mt'>
								<Btn type='Submit' utility='width-full'>
									Update
								</Btn>
							</p>
						</fieldset>
					</form>
				)}
			</main>
		</div>
	);
};

export default UserEdit;
