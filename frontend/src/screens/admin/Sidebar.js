import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../../assets/img/logo.png';

import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/userSlice';
import { orderPayReset } from '../../features/orderSlice';
import { cartReset } from '../../features/cartSlice';
import Delayed from '../../components/Delayed';

// icons
import { MdDashboard } from 'react-icons/md';
import { HiUsers } from 'react-icons/hi';
import { RiStore3Fill } from 'react-icons/ri';
import { BsFillCreditCard2FrontFill } from 'react-icons/bs';
import { CgMenu } from 'react-icons/cg';
import { MdReviews } from 'react-icons/md';

const Sidebar = ({ isAdmin }) => {
	const [isActive, setIsActive] = useState(true);
	const user = useSelector(state => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isMobile = useMediaQuery('(max-width: 740px)');

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
		} catch (error) {
			console.log('error', error);
		}
	};

	return user.currentUser?.role === 'admin' ? (
		<Delayed>
			<sidebar className={`sidebar ${isActive ? 'sidebar-active' : ''}`}>
				<div className='sidebar__logo'>
					<Link to='/admin'>
						<img alt='Logo' src={Logo} />
					</Link>
				</div>
				<div className='sidebar__center'>
					<ul className='sidebar__list'>
						<li className='sidebar__item'>
							<Link to='/admin' className='sidebar__link'>
								<span
									className={`sidebar__icon ${
										isActive ? 'sidebar-icon-active' : ''
									}`}>
									<MdDashboard />
								</span>
								<span
									className={`sidebar__text ${
										isActive ? 'sidebar-text-active' : ''
									}`}>
									Dashboard
								</span>
							</Link>
						</li>
						<li className='sidebar__item'>
							<Link to='/admin/users' className='sidebar__link'>
								<span
									className={`sidebar__icon ${
										isActive ? 'sidebar-icon-active' : ''
									}`}>
									<HiUsers />
								</span>
								<span
									className={`sidebar__text ${
										isActive ? 'sidebar-text-active' : ''
									}`}>
									Users
								</span>
							</Link>
						</li>
						<li className='sidebar__item'>
							<Link to='/admin/products' className='sidebar__link'>
								<span
									className={`sidebar__icon ${
										isActive ? 'sidebar-icon-active' : ''
									}`}>
									<RiStore3Fill />
								</span>
								<span
									className={`sidebar__text ${
										isActive ? 'sidebar-text-active' : ''
									}`}>
									products
								</span>
							</Link>
						</li>
						<li className='sidebar__item'>
							<Link to='/admin/orders' className='sidebar__link'>
								<span
									className={`sidebar__icon ${
										isActive ? 'sidebar-icon-active' : ''
									}`}>
									<BsFillCreditCard2FrontFill />
								</span>
								<span
									className={`sidebar__text ${
										isActive ? 'sidebar-text-active' : ''
									}`}>
									Orders
								</span>
							</Link>
						</li>
						<li className='sidebar__item'>
							<Link to='/admin/reviews' className='sidebar__link'>
								<span
									className={`sidebar__icon ${
										isActive ? 'sidebar-icon-active' : ''
									}`}>
									<MdReviews />
								</span>
								<span
									className={`sidebar__text ${
										isActive ? 'sidebar-text-active' : ''
									}`}>
									Reviews
								</span>
							</Link>
						</li>
					</ul>

					{isMobile && (
						<div className='u-mt-small'>
							<button className='sidebar__logout' onClick={logoutUser}>
								Log Out
							</button>
						</div>
					)}
				</div>
				<button
					className='sidebar__toggle'
					onClick={() => setIsActive(!isActive)}>
					<CgMenu />
				</button>
			</sidebar>
		</Delayed>
	) : null;
};

export default Sidebar;
