import React from 'react';

import { Link } from 'react-router-dom';

const SignInScreen = () => {
	return (
		<section className='sigin-screen'>
			<form className='form'>
				<fieldset>
					<legend className='heading-secondary'>Sign In</legend>

					<p className='form__group'>
						<label for='email'>Email</label>
						<input
							type='email'
							name='email'
							id='email'
							className='form__input'
						/>
					</p>
					<p className='form__group'>
						<label for='password'>Password</label>
						<input
							type='password'
							name='size'
							id='password'
							className='form__input'
						/>
					</p>

					<p className='form__group form__group--mt'>
						<input type='submit' value='Sign Up' className='btn with-full' />
					</p>

					<span className='form__option'>
						Not a member? <Link to='/register'>Register</Link>{' '}
					</span>
				</fieldset>
			</form>
		</section>
	);
};

export default SignInScreen;
