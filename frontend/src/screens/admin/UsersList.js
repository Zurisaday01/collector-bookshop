import { useEffect, useState } from 'react';
import axios from 'axios';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteStart,
	deleteSuccess,
	deleteFailure,
	fetchUsers,
} from '../../features/userSlice';

// Nav
import { Link } from 'react-router-dom';

// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';
import Loader from '../../components/Loader';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MdDelete, MdEdit } from 'react-icons/md';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const theme = createTheme({
	typography: {
		fontSize: 20,
	},
});

const UsersList = () => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	// search input
	const [searchInput, setSearchInput] = useState('');

	const dispatch = useDispatch();
	const { users, isLoading: loading } = useSelector(state => state.usersList);

	const { loading: loadingDelete } = useSelector(
		state => state.userAdminDelete
	);

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

	const handleDelete = async id => {
		// start deleting
		dispatch(deleteStart());

		// axios delete
		try {
			const res = await axios.delete(`/api/users/${id}`, {
				withCredentials: true,
			});

			dispatch(deleteSuccess());
			// after deleting fetch the users again
			dispatch(fetchUsers());
			// show and hide alert
			setIsSuccess(true);
			setTimeout(() => setIsSuccess(false), 2000);
		} catch (error) {
			dispatch(deleteFailure());
			// show and hide alert
			setIsFailure(true);
			setTimeout(() => setIsFailure(false), 2000);
		}
	};

	return (
		<div className='users-list'>
			{loadingDelete && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully deleted
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while deleting the user
			</Alert>

			<div className='users-list__top'>
				<h2 className='heading-secondar'>Users</h2>
				<Link className='btn' to='/admin/users/add'>
					Add User
				</Link>
			</div>

			<main>
				{loading ? (
					<Loader />
				) : (
					<ThemeProvider theme={theme}>
						<TextField
							id='outlined-basic'
							label="User's name"
							variant='outlined'
							onChange={e => setSearchInput(e.target.value)}
						/>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label='simple table'>
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Name</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Role</TableCell>

										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users
										.filter(user =>
											user.name
												.toLowerCase()
												.includes(searchInput.toLowerCase())
										)
										.map(user => (
											<TableRow
												key={user._id}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 },
												}}>
												<TableCell>{user._id}</TableCell>
												<TableCell>{user.name}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													{user.role === 'admin' ? (
														<span className='admin__role admin__role--admin'>
															{user.role}
														</span>
													) : (
														<span className='admin__role admin__role--user'>
															{user.role}
														</span>
													)}
												</TableCell>

												<TableCell className='admin__cell'>
													<button
														onClick={() => handleDelete(user._id)}
														className='admin__action'>
														<MdDelete />
													</button>
													<Link
														to={`/admin/users/edit/${user._id}`}
														className='admin__action'>
														<MdEdit />
													</Link>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>
					</ThemeProvider>
				)}
			</main>
		</div>
	);
};

export default UsersList;
