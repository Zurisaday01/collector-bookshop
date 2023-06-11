import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteStart,
	deleteSuccess,
	deleteFailure,
	fetchProducts,
} from '../../features/productSlice';
import axios from 'axios';

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
import { Link } from 'react-router-dom';

import { MdDelete, MdEdit } from 'react-icons/md';
import { GrFormClose } from 'react-icons/gr';
import { BsCheck } from 'react-icons/bs';
import { TextField } from '@mui/material';

import Alert from '../../components/Alert';

// tap loading progress
import TopBarProgress from 'react-topbar-progress-indicator';

const theme = createTheme({
	typography: {
		fontSize: 20,
	},
});

const ProductsList = () => {
	const [isSuccess, setIsSuccess] = useState(false);
	const [isFailure, setIsFailure] = useState(false);

	// search input
	const [searchInput, setSearchInput] = useState('');

	const dispatch = useDispatch();
	const { products, isLoading: loading } = useSelector(
		state => state.productList
	);

	const { loading: loadingDelete } = useSelector(state => state.productDelete);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const handleDelete = async id => {
		// start deleting
		dispatch(deleteStart());
		// axios delete
		try {
			const res = await axios.delete(`/api/products/${id}`, {
				withCredentials: true,
			});

			dispatch(deleteSuccess());
			// after deleting fetch the products again
			dispatch(fetchProducts());
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
		<div className='products-list'>
			{loadingDelete && <TopBarProgress />}
			<Alert type='success' screen='admin' showAlert={isSuccess}>
				Successfully deleted
			</Alert>
			<Alert type='fail' screen='admin' showAlert={isFailure}>
				Something went wrong while deleting the product
			</Alert>

			<div className='products-list__top'>
				<h2 className='heading-secondar'>Products</h2>
				<Link className='btn' to='/admin/products/add'>
					Add Product
				</Link>
			</div>
			<main>
				{loading ? (
					<Loader />
				) : (
					<ThemeProvider theme={theme}>
						<TextField
							id='outlined-basic'
							label="Product's name"
							variant='outlined'
							onChange={e => setSearchInput(e.target.value)}
						/>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label='simple table'>
								<TableHead>
									<TableRow>
										<TableCell>ID</TableCell>
										<TableCell>Name</TableCell>
										<TableCell>Author</TableCell>
										<TableCell>Bestseller</TableCell>
										<TableCell>Categories</TableCell>
										<TableCell>Price</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{products
										.filter(product =>
											product.name
												.toLowerCase()
												.includes(searchInput.toLowerCase())
										)
										.map(product => (
											<TableRow
												key={product._id}
												sx={{
													'&:last-child td, &:last-child th': { border: 0 },
												}}>
												<TableCell>{product._id}</TableCell>
												<TableCell>{product.name}</TableCell>
												<TableCell>{product.author}</TableCell>
												<TableCell>
													{product.bestseller ? (
														<span className='admin__bestseller admin__bestseller--true'>
															<BsCheck />
														</span>
													) : (
														<span className='admin__bestseller admin__bestseller--false'>
															<GrFormClose />
														</span>
													)}
												</TableCell>
												<TableCell>{product.category.join(', ')}</TableCell>
												<TableCell>${product.price}</TableCell>
												<TableCell className='admin__cell'>
													<button
														className='admin__action'
														onClick={() => handleDelete(product._id)}>
														<MdDelete />
													</button>
													<Link
														to={`/admin/products/edit/${product._id}`}
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

export default ProductsList;
