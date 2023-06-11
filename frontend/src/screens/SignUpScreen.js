import { useState } from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
// Redux
import { loginStart, loginSuccess, loginFailure } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

// components
import Btn from '../components/Btn';
import FormInput from '../components/FormInput';
import Alert from '../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const SignUpScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading } = useSelector(state => state.user);

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const [message, setMessage] = useState('');

	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		passwordConfirm: '',
	});

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

		// starting login
		dispatch(loginStart());

		// sending data user input
		try {
			const { data } = await axios.post(
				'/api/users/signup',
				{
					name: values.name,
					email: values.email,
					password: values.password,
					passwordConfirm: values.passwordConfirm,
				},
				{
					withCredentials: true,
				}
			);
			dispatch(loginSuccess(data.data.user));

			setMessage(
				'Thanks for using collector, you can try your new account right now!! 😉'
			);
			setIsSuccess(true);

			// clear inputs
			setValues({
				name: '',
				email: '',
				password: '',
				passwordConfirm: '',
			});

			e.target.reset();

			const panout = new Promise((resolve, reject) =>
				setTimeout(() =>
					setTimeout(() => {
						setIsSuccess(false);
						resolve();
					}, 3000)
				)
			);

			const redirection = new Promise((resolve, reject) =>
				setTimeout(() =>
					setTimeout(() => {
						if (data.data.user.role === 'admin') {
							navigate('/signin');
						} else {
							navigate('/');
						}
						resolve();
					}, 3000)
				)
			);
			Promise.all([panout, redirection]);
		} catch (error) {
			dispatch(loginFailure());

			setMessage('Something went wrong. Try again later!');

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	return (
		<section className='signup-screen'>
			{loading && <TopBarProgress />}
			<Alert
				type={(isSuccess && 'success') || (isFailure && 'fail')}
				screen='user'
				showAlert={(isSuccess && isSuccess) || (isFailure && isFailure)}>
				{message}
			</Alert>
			<form className='form' onSubmit={handleSubmit}>
				<fieldset>
					<legend className='heading-secondary'>Create account</legend>

					{inputs.map(input => (
						<FormInput
							key={input.id}
							{...input}
							value={values[input.name]}
							onChange={onChange}
						/>
					))}

					<p className='form__group form__group--mt'>
						<Btn type='Submit' utility='width-full'>
							Sign Up
						</Btn>
					</p>

					<span className='form__option'>
						Already have an account? <Link to='/signin'>Sign In</Link>{' '}
					</span>
				</fieldset>
			</form>
		</section>
	);
};

export default SignUpScreen;
