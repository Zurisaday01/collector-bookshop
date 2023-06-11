import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/img/logo_full.png';
import { AiOutlineShopping } from 'react-icons/ai';
import { CgMenu, CgClose } from 'react-icons/cg';
// redux
import { useDispatch, useSelector } from 'react-redux';
import DropdownUser from './DropdownUser';
import axios from 'axios';
import { logout } from '../features/userSlice';
import { orderPayReset } from '../features/orderSlice';
import { cartReset } from '../features/cartSlice';

const Navbar = ({
	setSelectedCategory,
	setIsAdmin,
	isPhotoUpdated,
	setIsPhotoUpdated,
}) => {
	const [basketToggle, setBasketToggle] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector(state => state.user);
	const cart = useSelector(state => state.cart);
	const { cartItems } = cart;

	let counterQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

	if (user.currentUser?.role === 'admin') {
		setIsAdmin(true);
	}

	const logoutUser = async () => {
		try {
			const res = await axios.get('/api/users/logout', {
				withCredentials: true,
			});

			// user log out
			dispatch(logout());
			// order log out - reset
			dispatch(orderPayReset());
			// cart log out - reset
			dispatch(cartReset());
			// log in again
			navigate('/signin');
			// remove mobile sidebar
			setIsMobile(false);
		} catch (error) {
			console.log('error', error);
			// setErrMsg(true);
			// setTimeout(() => setErrMsg(false), 2000);
			// dispatch(loginFailure());
		}
	};

	return user.currentUser?.role === 'user' || !user.currentUser ? (
		<nav className='navigation'>
			<div className='logo'>
				<Link to='/'>
					<img alt='Logo' src={Logo} />
				</Link>
			</div>

			<ul className='navigation__main'>
				<li>
					<NavLink className='navigation__link' exact='true' to='/'>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink
						className='navigation__link'
						exact='true'
						to='/shop'
						onClick={() => setSelectedCategory('All books')}>
						Shop
					</NavLink>
				</li>
			</ul>

			<ul className='navigation__menu'>
				<li>
					<Link
						to='/cart'
						className='button-link navigation-menu-basket basket-toggle basket-btn'
						onClick={() => setBasketToggle(!basketToggle)}>
						<span className='basket-btn basket-btn__counter'>{counterQty}</span>
						<AiOutlineShopping />
					</Link>
				</li>

				<li className='navigation__user-options '>
					{user.currentUser ? (
						<DropdownUser
							updating={user.updating}
							name={user.currentUser.name}
							photo={user.currentUser.photo}
							role={user.currentUser.role}
							isPhotoUpdated={isPhotoUpdated}
							setIsPhotoUpdated={setIsPhotoUpdated}
						/>
					) : (
						<Link
							className='button button-small button-muted margin-left-s btn'
							to='/signin'>
							Sign In
						</Link>
					)}
				</li>

				<button
					className='navigation__menu-icon'
					onClick={() => setIsMobile(true)}>
					<CgMenu />
				</button>
			</ul>

			{/* backdrop */}
			<div
				className={`navigation__backdrop ${
					isMobile ? 'navigation-active-backdrop' : ''
				}`}></div>

			<ul
				className={`navigation-mobile ${isMobile ? 'navigation-active' : ''}`}>
				<button
					className='navigation-mobile__menu-icon'
					onClick={() => setIsMobile(false)}>
					<CgClose />
				</button>
				<li
					className={`${
						user.currentUser && 'navigation-mobile__user-options'
					}`}>
					{user.currentUser ? (
						<DropdownUser
							updating={user.updating}
							name={user.currentUser.name}
							photo={user.currentUser.photo}
							role={user.currentUser.role}
							setIsMobile={setIsMobile}
						/>
					) : (
						<Link
							className='button button-small button-muted margin-left-s btn sign-in'
							onClick={() => setIsMobile(false)}
							to='/signin'>
							Sign In
						</Link>
					)}
				</li>
				<li>
					<NavLink
						className='navigation-mobile__link'
						onClick={() => setIsMobile(false)}
						exact='true'
						to='/'>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink
						className='navigation-mobile__link'
						exact='true'
						to='/shop'
						onClick={() => {
							setSelectedCategory('All books');
							setIsMobile(false);
						}}>
						Shop
					</NavLink>
				</li>

				{user.currentUser && (
					<li className='navigation-mobile__box-logout'>
						<button className='navigation-mobile__logout' onClick={logoutUser}>
							Log Out
						</button>
					</li>
				)}
			</ul>
		</nav>
	) : (
		<nav className='navigation navigation--admin'>
			{user.currentUser && (
				<DropdownUser
					updating={user.updating}
					name={user.currentUser.name}
					photo={user.currentUser.photo}
					role={user.currentUser.role}
				/>
			)}
		</nav>
	);
};

export default Navbar;
