import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('fetchProducts', async () => {
	try {
		const { data } = await axios.get('http://localhost:5000/api/products');
		return data;
	} catch (error) {
		console.error(error);
	}
});
export const fetchProduct = createAsyncThunk('fetchProduct', async id => {
	try {
		const { data } = await axios.get(
			`http://localhost:5000/api/products/${id}`
		);
		return data;
	} catch (error) {
		console.error(error);
	}
});

export const productListReducer = createSlice({
	name: 'products',
	initialState: {
		products: [],
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchProducts.pending, state => {
				state.products = [];
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.products = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const productDetailsReducer = createSlice({
	name: 'product',
	initialState: {
		product: { reviews: [] },
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchProduct.pending, state => {
				state.product = { reviews: [] };
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchProduct.fulfilled, (state, action) => {
				state.product = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchProduct.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});
