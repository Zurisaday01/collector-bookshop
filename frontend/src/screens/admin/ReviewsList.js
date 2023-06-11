import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

//
import {
	deleteStart,
	deleteSuccess,
	deleteFailure,
	fetchReviews,
} from '../../features/reviewSlice';

// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Loader from '../../components/Loader';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MdDelete } from 'react-icons/md';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const theme = createTheme({
	typography: {
		fontSize: 20,
	},
});

const ReviewsList = () => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);
	const dispatch = useDispatch();
	const { reviews, isLoading: loading } = useSelector(
		state => state.reviewList
	);
	const { loading: loadingDelete } = useSelector(state => state.reviewDelete);

	useEffect(() => {
		dispatch(fetchReviews());
	}, [dispatch]);

	const handleDelete = async id => {
		// start deleting
		dispatch(deleteStart());

		// axios delete
		try {
			const res = await axios.delete(`/api/reviews/${id}`, {
				withCredentials: true,
			});

			dispatch(deleteSuccess());
			// after deleting fetch the users again
			dispatch(fetchReviews());
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
		<div className='review-list'>
			{loadingDelete && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully deleted
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while deleting the review
			</Alert>

			<div className='review-list__top'>
				<h2 className='heading-secondar'>Reviews</h2>
			</div>

			<main>
				{loading ? (
					<Loader />
				) : (
					<ThemeProvider theme={theme}>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label='simple table'>
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Date</TableCell>
										<TableCell>Product</TableCell>
										<TableCell>User</TableCell>
										<TableCell>Rating</TableCell>
										<TableCell style={{ width: 220 }}>Review</TableCell>

										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{reviews.map(review => (
										<TableRow
											key={review._id}
											sx={{
												'&:last-child td, &:last-child th': { border: 0 },
											}}>
											<TableCell>{review._id}</TableCell>
											<TableCell>{review.createAt.substring(0, 10)}</TableCell>
											<TableCell>{review.product.name}</TableCell>
											<TableCell>{review.user.name}</TableCell>
											<TableCell>{review.rating}</TableCell>
											<TableCell>
												{review.review
													.replaceAll('/n', ' ')
													.slice(0, 200)
													.concat('...')}
											</TableCell>

											<TableCell className='admin__cell'>
												<button
													onClick={() => handleDelete(review._id)}
													className='admin__action'>
													<MdDelete />
												</button>
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

export default ReviewsList;
