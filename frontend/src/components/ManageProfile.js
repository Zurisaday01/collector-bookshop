import { useState } from 'react';
import axios from 'axios';
import { updateStart, updateUser, updateFailure } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

// components
import Btn from './Btn';
import FormInput from './FormInput';

const ManageProfile = ({ setSuccess, setFailure }) => {
	const dispatch = useDispatch();
	const { currentUser } = useSelector(state => state.user);

	const [values, setValues] = useState({
		name: currentUser.name,
		email: currentUser.email,
	});

	const inputs = [
		{
			id: 1,
			name: 'name',
			type: 'text',
			placeholder: 'Your name and last name',
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
	];

	const onChange = e => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		// start updating
		dispatch(updateStart());

		// update
		try {
			const { data } = await axios.patch(
				'/api/users/updateProfile',
				{
					name: values.name,
					email: values.email,
				},
				{
					withCredentials: true,
				}
			);

			dispatch(updateUser(data.data.user));
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (error) {
			dispatch(updateFailure());
			setFailure(true);
			setTimeout(() => setFailure(false), 3000);
		}
	};
	return (
		<form onSubmit={handleSubmit} className='form u-no-border u-flex-gap'>
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

export default ManageProfile;
