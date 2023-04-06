import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/img/logo_full.png';
import { AiOutlineShopping } from 'react-icons/ai';

// elements
import BasketBtn from './BasketBtn';
import Btn from './Btn';

const Navbar = () => {
	const [user, setUser] = useState(false);
	const [basketToggle, setBasketToggle] = useState(false);

	const [navbar, setNavbar] = useState(false);

	const stickyBackground = () => {
		if (window.screenY >= 80) {
			setNavbar(true);
		} else {
			setNavbar(false);
		}
	};

	window.addEventListener('scroll', stickyBackground);

	return (
		<nav className={navbar ? 'navigation sticky' : 'navigation'}>
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
					<NavLink className='navigation__link' exact='true' to='/shop'>
						Shop
					</NavLink>
				</li>
			</ul>
			<ul className='navigation-menu'>
				<li className='navigation-menu-item'>
					<Link
						to='/cart'
						className='button-link navigation-menu-link basket-toggle basket-btn'
						onClick={() => setBasketToggle(!basketToggle)}>
						<AiOutlineShopping />
					</Link>
				</li>
				{user ? (
					<li className='navigation-menu-item'>
						{/* <UserAvatar /> */}
						user
					</li>
				) : (
					<li className='navigation-action'>
						<Link
							className='button button-small button-muted margin-left-s btn'
							to='/signin'>
							Sign In
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;
