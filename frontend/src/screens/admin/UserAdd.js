import { useState } from 'react';
import axios from 'axios';
// Nav
import { Link } from 'react-router-dom';

// components
import Btn from '../../components/Btn';
import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';
import { useDispatch, useSelector } from 'react-redux';
import {
	createStart,
	createSuccess,
	createFailure,
} from '../../features/userSlice';
import FormInput from '../../components/FormInput';

const UserAdd = () => {
	const { loading } = useSelector(state => state.userAdminCreate);

	const dispatch = useDispatch();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
	});
	// default
	const [role, setRole] = useState('user');

	const inputs = [
		{
			id: 1,
			name: 'name',
			type: 'text',
			placeholder: 'First and last name',
			title:
				'Characters in the range (Aa - Zz), must contain a space ( ) and numbers, underscores, hyphens are not allowed',
			label: 'Your name',
			pattern:
				'(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})',
			required: true,
		},
		{
			id: 2,
			name: 'email',
			type: 'email',
			placeholder: 'example@gmail.com',
			title: 'It should be a valid email address!',
			label: 'Email',
			pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
			required: true,
		},

		{
			id: 3,
			name: 'password',
			type: 'password',
			placeholder: 'At least 6 characters',
			title:
				'Password should be at least 6 characters and include at least 1 letter, 1 number and 1 special character! Uppercase (A-Z) and lowercase (a-z) English letters',
			label: 'Password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
		{
			id: 4,
			name: 'passwordConfirm',
			type: 'password',
			title: 'Must match the first password input field.',
			label: 'Re-enter password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
	];

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });

		const password = document.getElementById('3');
		const confirm_password = document.getElementById('4');

		if (password.value !== confirm_password.value) {
			confirm_password.setCustomValidity(confirm_password.title);
		} else {
			confirm_password.setCustomValidity('');
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		// create user
		dispatch(createStart());

		try {
			const res = await axios.post(
				'/api/users/create',
				{
					name: values.name,
					email: values.email,
					password: values.password,
					passwordConfirm: values.passwordConfirm,
					role: role,
				},
				{
					withCredentials: true,
				}
			);

			dispatch(createSuccess());

			// show and hide alert
			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 2000);

			// clear inputs
			setValues({
				name: '',
				email: '',
				password: '',
				passwordConfirm: '',
			});

			// clean inputs
			e.target.reset();
		} catch (error) {
			dispatch(createFailure());
			// show and hide alert
			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 2000);
			// clean inputs

			setValues({
				name: '',
				email: '',
				password: '',
				passwordConfirm: '',
			});
			e.target.reset();
		}
	};

	return (
		<div className='user-add'>
			{loading && <TopBarProgress />}
			<Alert type='success' screen='add' showAlert={isSuccess}>
				Successfully created
			</Alert>
			<Alert type='fail' screen='add' showAlert={isFailure}>
				Something went wrong while creating the user. Try again or check if you
				already have the user in the database
			</Alert>
			<div className='user-add__top'>
				<Link className='btn' to='/admin/users'>
					Back
				</Link>
			</div>
			<main>
				<form className='form u-no-border form--crud' onSubmit={handleSubmit}>
					<fieldset>
						<legend className='heading-secondary'>Add User</legend>
						{inputs.map(input => (
							<FormInput
								key={input.id}
								{...input}
								value={values[input.name]}
								onChange={onChange}
							/>
						))}
						<p className='form__group'>
							<label htmlFor='role'>Role</label>
							<select
								onChange={e => setRole(e.target.value)}
								name='role'
								id='role'
								className='form__input'>
								<option value='user'>User</option>
								<option value='admin'>Admin</option>
							</select>
						</p>
						<p className='form__group form__group--mt'>
							<Btn type='Submit' utility='width-full'>
								Add
							</Btn>
						</p>
					</fieldset>
				</form>
			</main>
		</div>
	);
};

export default UserAdd;
