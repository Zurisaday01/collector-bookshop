import { useState } from 'react';
import axios from 'axios';

// components
import Btn from './Btn';
import FormInput from './FormInput';

const ManageAccount = ({ setSuccess, setFailure, setNewMessage }) => {
	const [values, setValues] = useState({
		passwordCurrent: '',
		password: '',
		passwordConfirm: '',
	});

	const inputs = [
		{
			id: 1,
			name: 'passwordCurrent',
			type: 'password',
			placeholder: 'Your password',
			title:
				'Password should be at least 6 characters and include at least 1 letter, 1 number and 1 special character! Uppercase (A-Z) and lowercase (a-z) English letters',
			label: 'Current password',
			pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$`,
			required: true,
		},
		{
			id: 2,
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
			id: 3,
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

		const password = document.getElementById('2');
		const confirm_password = document.getElementById('3');

		if (password.value !== confirm_password.value) {
			confirm_password.setCustomValidity(confirm_password.title);
		} else {
			confirm_password.setCustomValidity('');
		}
	};

	const handleSubmit = async e => {
		e.preventDefault();

		try {
			const data = await axios.patch(
				'/api/users/updateMyPassword',
				{
					passwordCurrent: values.passwordCurrent,
					password: values.password,
					passwordConfirm: values.passwordConfirm,
				},
				{
					withCredentials: true,
				}
			);
			// clean inputs
			setValues({
				passwordCurrent: '',
				password: '',
				passwordConfirm: '',
			});

			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (error) {
			setNewMessage(error.response.data.message);

			setFailure(true);
			setTimeout(() => setFailure(false), 3000);
		}
	};

	return (
		<form className='form u-no-border u-flex-gap' onSubmit={handleSubmit}>
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
					Save
				</Btn>
			</p>
		</form>
	);
};

export default ManageAccount;
