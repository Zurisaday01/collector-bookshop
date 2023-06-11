import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
// Nav
import { Link } from 'react-router-dom';

// icons
import { AiFillCheckCircle } from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';

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

// validate regex
const USER_REGEX =
	/(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const UserAdd = () => {
	const { loading } = useSelector(state => state.userAdminCreate);

	const dispatch = useDispatch();

	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	const userRef = useRef();

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

	// default
	const [role, setRole] = useState('user');

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

	const handleSubmit = async e => {
		e.preventDefault();

		// create user
		dispatch(createStart());

		try {
			const res = await axios.post(
				'http://localhost:5000/api/users/create',
				{
					name: user,
					email: email,
					password: pwd,
					passwordConfirm: matchPwd,
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

			// clean inputs
			setPwd('');
			setMatchPwd('');
			e.target.reset();
		} catch (error) {
			dispatch(createFailure());
			console.log(error);
			// show and hide alert
			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 2000);
			// clean inputs
			e.target.reset();
			setPwd('');
			matchPwd('');
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
						<p className='form__group'>
							<label htmlFor='name'>
								Name
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
									userFocus && user && !validName ? 'instructions' : 'offscreen'
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
										validPwd || !pwd ? 'hide' : 'form__icon form__icon--invalid'
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
							<Btn
								type='Submit'
								utility='width-full'
								disabled={!(validName && validEmail && validPwd && validMatch)}>
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
