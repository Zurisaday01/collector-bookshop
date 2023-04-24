import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { signUpUser } from '../features/userSlice';

// icons
import { AiFillCheckCircle } from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';

// components
// import Message from '../components/Message';
import Btn from '../components/Btn';

// validate regex
const USER_REGEX =
	/(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const SignUpScreen = () => {
	const dispatch = useDispatch();

	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	const login = async (name, email, password, passwordConfirm) => {
		try {
			const { data } = await axios.post(
				'http://localhost:5000/api/users/signup',
				{
					name: name,
					email: email,
					password: password,
					passwordConfirm: passwordConfirm,
				},
				{
					headers: {
						withCredentials: true,
					},
				}
			);

			console.log(data);
			console.log(data.data.user);
		} catch (error) {
			console.log(error);
		}
	};

	// Setting the focus when the component loads = set the focus on that user name input
	useEffect(() => {
		userRef.current.focus();
	}, []);

	// validate the user name
	useEffect(() => {
		// is the name valid? true, false
		setValidName(USER_REGEX.test(user));
	}, [user]);

	// validate the user email
	useEffect(() => {
		// is the name valid? true, false
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	// validate the password
	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
		// check is the passwords are the same [password] === [re-enter password]
		// Do they match? is it valid? true, false
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd]);

	// every time the user changes, password changes and match as well
	useEffect(() => {
		// clean the error
		setErrMsg('');
	}, [user, email, pwd, matchPwd]);

	const handleSubmit = async e => {
		e.preventDefault();

		// console.log(user, email, pwd, matchPwd);
		// dispatch(signUpUser({ user, email, pwd, matchPwd }));

		login(user, email, pwd, matchPwd);
		// setSuccess(true);
	};

	return (
		<>
			{' '}
			{success ? (
				<Navigate replace to='/' />
			) : (
				<section className='signup-screen'>
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live='assertive'>
						{errMsg}
					</p>
					<form className='form' onSubmit={handleSubmit}>
						<fieldset>
							<legend className='heading-secondary'>Create account</legend>
							<p className='form__group'>
								<label htmlFor='name'>
									Your name
									<span
										className={
											validName ? 'form__icon form__icon--valid' : 'hide'
										}>
										<AiFillCheckCircle />
									</span>
									<span
										className={
											validName || !user
												? 'hide'
												: 'form__icon form__icon--invalid'
										}>
										<FaTimesCircle />
									</span>
								</label>
								<input
									type='text'
									name='name'
									id='name'
									ref={userRef}
									autoComplete='off'
									onChange={e => setUser(e.target.value)}
									aria-invalid={validName ? 'false' : 'true'}
									aria-describedby='uidnote'
									onFocus={() => setUserFocus(true)}
									onBlur={() => setUserFocus(false)}
									placeholder='First and last name'
									className='form__input'
									required
								/>

								<span
									id='uidnote'
									className={
										userFocus && user && !validName
											? 'instructions'
											: 'offscreen'
									}>
									Characters in the range (Aa - Zz)
									<br />
									Must contain a space ( )
									<br />
									Numbers, underscores, hyphens don't allowed
								</span>
							</p>
							<p className='form__group'>
								<label htmlFor='email'>
									Email
									<span
										className={
											validEmail ? 'form__icon form__icon--valid' : 'hide'
										}>
										<AiFillCheckCircle />
									</span>
									<span
										className={
											validEmail || !email
												? 'hide'
												: 'form__icon form__icon--invalid'
										}>
										<FaTimesCircle />
									</span>
								</label>
								<input
									type='email'
									name='email'
									id='email'
									autoComplete='off'
									onChange={e => setEmail(e.target.value)}
									aria-invalid={validEmail ? 'false' : 'true'}
									aria-describedby='emailnote'
									onFocus={() => setEmailFocus(true)}
									onBlur={() => setEmailFocus(false)}
									placeholder='example@gmail.com'
									className='form__input'
									required
								/>

								<span
									id='emailnote'
									className={
										emailFocus && email && !validEmail
											? 'instructions'
											: 'offscreen'
									}>
									Uppercase (A-Z) and lowercase (a-z) English letters
									<br />
									Digits (0-9).
									<br />
									Characters ! # $ % & ' * + - / = ? ^ _ ` allowed
								</span>
							</p>
							<p className='form__group'>
								<label htmlFor='password'>
									Password
									<span
										className={
											validPwd ? 'form__icon form__icon--valid' : 'hide'
										}>
										<AiFillCheckCircle />
									</span>
									<span
										className={
											validPwd || !pwd
												? 'hide'
												: 'form__icon form__icon--invalid'
										}>
										<FaTimesCircle />
									</span>
								</label>
								<input
									type='password'
									name='password'
									id='password'
									onChange={e => setPwd(e.target.value)}
									value={pwd}
									placeholder='At least 6 characters'
									className='form__input'
									aria-invalid={validPwd ? 'false' : 'true'}
									aria-describedby='pwdnote'
									onFocus={() => setPwdFocus(true)}
									onBlur={() => setPwdFocus(false)}
									required
								/>
								<span
									id='pwdnote'
									className={
										pwdFocus && !validPwd ? 'instructions' : 'offscreen'
									}>
									Must contain at least 6 characters
									<br />
									Must include uppercase and lowercase letters, a number and a
									special character.
									<br />
									Allowed special characters:{' '}
									<span aria-label='exclamation mark'>!</span>{' '}
									<span aria-label='at symbol'>@</span>{' '}
									<span aria-label='hashtag'>#</span>{' '}
									<span aria-label='dollar sign'>$</span>{' '}
									<span aria-label='percent'>%</span>
								</span>
							</p>
							<p className='form__group'>
								<label htmlFor='re-password'>
									Re-enter password
									<span
										className={
											validMatch && matchPwd
												? 'form__icon form__icon--valid'
												: 'hide'
										}>
										<AiFillCheckCircle />
									</span>
									<span
										className={
											validMatch || !matchPwd
												? 'hide'
												: 'form__icon form__icon--invalid'
										}>
										<FaTimesCircle />
									</span>
								</label>
								<input
									type='password'
									name='re-password'
									id='re-password'
									value={matchPwd}
									className='form__input'
									onChange={e => setMatchPwd(e.target.value)}
									aria-invalid={validMatch ? 'false' : 'true'}
									aria-describedby='confirmnote'
									onFocus={() => setMatchFocus(true)}
									onBlur={() => setMatchFocus(false)}
									required
								/>
								<span
									id='confirmnote'
									className={
										matchFocus && !validMatch ? 'instructions' : 'offscreen'
									}>
									Must match the first password input field.
								</span>
							</p>
							<p className='form__group form__group--mt'>
								<Btn
									type='Submit'
									utility='with-full'
									disabled={
										!(validName && validEmail && validPwd && validMatch)
									}>
									Sign Up
								</Btn>
							</p>

							<span className='form__option'>
								Already have an account? <Link to='/signin'>Sign In</Link>{' '}
							</span>
						</fieldset>
					</form>
				</section>
			)}
		</>
	);
};

export default SignUpScreen;
