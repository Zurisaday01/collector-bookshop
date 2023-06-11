import React from 'react';

import { HiOutlineUsers } from 'react-icons/hi';
import { TbBooks } from 'react-icons/tb';
import { BiCreditCard } from 'react-icons/bi';
import { FaMoneyBillAlt } from 'react-icons/fa';

const CardStats = ({ title, stats, iconname }) => {
	return (
		<div className='card-stats'>
			<h3 className='heading-tertiary'>{title}</h3>
			<span className='card-stats__stats'>{stats}</span>

			{iconname === 'users' ? (
				<button className='card-stats__icon card-stats__icon--users'>
					<HiOutlineUsers />
				</button>
			) : iconname === 'products' ? (
				<button className='card-stats__icon card-stats__icon--products'>
					<TbBooks />
				</button>
			) : iconname === 'orders' ? (
				<button className='card-stats__icon card-stats__icon--orders'>
					<BiCreditCard />
				</button>
			) : iconname === 'earnings' ? (
				<button className='card-stats__icon card-stats__icon--earnings'>
					<FaMoneyBillAlt />
				</button>
			) : null}
		</div>
	);
};

export default CardStats;
