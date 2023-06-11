import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Btn from '../components/Btn';
import { loginStart, loginSuccess, loginFailure } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FormInput from '../components/FormInput';
import Alert from '../components/Alert';
// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const SignInScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);
	const { loading } = useSelector(state => state.user);

	const [message, setMessage] = useState('');

	const [values, setValues] = useState({
		email: '',
		password: '',
	});

	const inputs = [
		{
			id: 1,
			name: 'email',
			type: 'email',
			placeholder: 'example@gmail.com',
			title: 'It should be a valid email address!',
			label: 'Email',
			pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
			required: true,
		},

		{
			id: 2,
			name: 'password',
			type: 'password',
			placeholder: 'At least 6 characters',
			title:
				'Password should be at least 6 characters and include at least 1 letter, 1 number and 1 special character! Uppercase (A-Z) and lowercase (a-z) English letters',
			label: 'Password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
	];

	const handleSubmit = async e => {
		e.preventDefault();

		// starting login
		dispatch(loginStart());
		// sending data user input
		try {
			const { data } = await axios.post(
				'/api/users/signin',
				{
					email: values.email,
					password: values.password,
				},
				{
					withCredentials: true,
				}
			);
			dispatch(loginSuccess(data.data.user));
			setIsSuccess(true);

			setMessage('Welcome to collector! 😎');

			// clear inputs
			setValues({
				email: '',
				password: '',
			});

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
							navigate('/admin');
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
			if (error.response.data.message.includes("(reading 'correctPassword')")) {
				setMessage('Something went wrong, please try again later! 🥺');
			} else {
				setMessage(error.response.data.message);
			}

			// clear inputs
			setValues({
				email: '',
				password: '',
			});

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	return (
		<section className='sigin-screen'>
			{loading && <TopBarProgress />}
			<Alert
				type={(isSuccess && 'success') || (isFailure && 'fail')}
				screen='user'
				showAlert={(isSuccess && isSuccess) || (isFailure && isFailure)}>
				{message}
			</Alert>
			<form className='form' onSubmit={handleSubmit}>
				<fieldset>
					<legend className='heading-secondary'>Sign In</legend>

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
							Sign In
						</Btn>
					</p>

					<span className='form__option u-mt-small'>
						Not a member? <Link to='/register'>Register</Link>{' '}
					</span>
					<span className='form__option'>
						Forgot password? <Link to='/forgotPassword'>Here</Link>{' '}
					</span>
				</fieldset>
			</form>
		</section>
	);
};

export default SignInScreen;
