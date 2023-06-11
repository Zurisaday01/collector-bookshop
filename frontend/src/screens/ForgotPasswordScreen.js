import { useState } from 'react';
import Btn from '../components/Btn';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/FormInput';
import Alert from '../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const ForgotPasswordScreen = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);
	const [loading, setLoading] = useState(false);

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
	];

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);
		try {
			const { data } = await axios.post(
				'/api/users/forgotPassword',
				{
					email,
				},
				{
					withCredentials: true,
				}
			);
			setLoading(false);
			setIsSuccess(true);

			setMessage(data.message);

			// clean input
			setEmail('');

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

			// clean input
			setEmail('');

			setMessage(error.response.data.message);

			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 3000);
		}
	};

	return (
		<section className='forgot-screen'>
			{loading && <TopBarProgress />}
			<Alert
				type={(isSuccess && 'success') || (isFailure && 'fail')}
				screen='user'
				showAlert={(isSuccess && isSuccess) || (isFailure && isFailure)}>
				{message}
			</Alert>
			<form className='form' onSubmit={handleSubmit}>
				<fieldset>
					<legend className='heading-secondary'>Forgot Password</legend>

					{inputs.map(input => (
						<FormInput
							key={input.id}
							{...input}
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					))}

					<p className='form__group form__group--mt'>
						<Btn type='Submit' utility='width-full'>
							Submit
						</Btn>
					</p>

					<span className='form__option u-mt-small'>
						Got your password? <Link to='/signin'>Sign In</Link>{' '}
					</span>
				</fieldset>
			</form>
		</section>
	);
};

export default ForgotPasswordScreen;
