import { useState } from 'react';

import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

// components
import Btn from '../components/Btn';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';

const ResetPasswordScreen = () => {
	const { token } = useParams();
	const navigate = useNavigate();

	const [message, setMessage] = useState('');

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);
	const [loading, setLoading] = useState(false);

	const [values, setValues] = useState({
		password: '',
		passwordConfirm: '',
	});

	const inputs = [
		{
			id: 1,
			name: 'password',
			type: 'password',
			placeholder: 'At least 6 characters',
			title:
				'Password should be at least 6 characters and include at least 1 letter, 1 number and 1 special character! Uppercase (A-Z) and lowercase (a-z) English letters',
			label: 'New password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
		{
			id: 2,
			name: 'passwordConfirm',
			type: 'password',
			title: 'Must match the new password input field.',
			label: 'Re-enter new password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
	];

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });

		const password = document.getElementById('1');
		const confirm_password = document.getElementById('2');

		if (password.value !== confirm_password.value) {
			confirm_password.setCustomValidity(confirm_password.title);
		} else {
			confirm_password.setCustomValidity('');
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);
		try {
			const { data } = await axios.patch(
				`/api/users//resetPassword/${token}`,
				{
					password: values.password,
					passwordConfirm: values.passwordConfirm,
				},
				{
					withCredentials: true,
				}
			);

			setMessage('Your password has been reset successfully');

			setLoading(false);
			setIsSuccess(true);

			// clean inputs
			setValues({
				password: '',
				passwordConfirm: '',
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
						navigate('/signin');
						resolve();
					}, 3000)
				)
			);

			Promise.all([panout, redirection]);
		} catch (error) {
			setLoading(false);

			setMessage(error.response.data.message);

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	return (
		<section className='reset-screen'>
			{loading && <TopBarProgress />}
			<Alert
				type={(isSuccess && 'success') || (isFailure && 'fail')}
				screen='user'
				showAlert={(isSuccess && isSuccess) || (isFailure && isFailure)}>
				{message}
			</Alert>
			<form className='form u-flex-gap' onSubmit={handleSubmit}>
				<fieldset>
					<legend className='heading-secondary'>Reset Password</legend>
					{inputs.map(input => (
						<FormInput
							key={input.id}
							{...input}
							value={values[input.name]}
							onChange={onChange}
						/>
					))}
					<p className='form__group form__group--mt u-align-start'>
						<Btn type='Submit' utility='width-full'>
							Reset
						</Btn>
					</p>
				</fieldset>
			</form>
		</section>
	);
};

export default ResetPasswordScreen;
