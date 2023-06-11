import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk('fetchProducts', async () => {
	try {
		const { data } = await axios.get('/api/products');

		return data.products;
	} catch (error) {
		console.error(error);
	}
});
export const fetchProduct = createAsyncThunk('fetchProduct', async id => {
	try {
		const { data } = await axios.get(`/api/products/${id}`);
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
		success: false,
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
				state.success = true;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchProduct.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
	reducers: {
		productReset: state => {
			state.product = {};
			state.isLoading = false;
			state.hasError = false;
			state.success = false;
		},
	},
});

export const { productReset } = productDetailsReducer.actions;

// Admin delete
export const productDeleteReducer = createSlice({
	name: 'productDelete',
	initialState: {
		success: false,
		loading: false,
		error: false,
	},

	reducers: {
		deleteStart: state => {
			state.loading = true;
		},
		deleteSuccess: state => {
			state.loading = false;
			state.success = true;
		},
		deleteFailure: state => {
			state.loading = false;
			state.error = true;
		},
	},
});

export const { deleteStart, deleteSuccess, deleteFailure } =
	productDeleteReducer.actions;

// Admin create
export const productCreateReducer = createSlice({
	name: 'productCreate',
	initialState: {
		success: false,
		loading: false,
		error: false,
	},

	reducers: {
		createStart: state => {
			state.loading = true;
		},
		createSuccess: state => {
			state.loading = false;
			state.success = true;
		},
		createFailure: state => {
			state.loading = false;
			state.error = true;
		},
	},
});

export const { createStart, createSuccess, createFailure } =
	productDeleteReducer.actions;

// Admin add
export const productAddReducer = createSlice({
	name: 'productAdd',
	initialState: {
		success: false,
		loading: false,
		error: false,
	},

	reducers: {
		addStart: state => {
			state.loading = true;
		},
		addSuccess: state => {
			state.loading = false;
			state.success = true;
		},
		addFailure: state => {
			state.loading = false;
			state.error = true;
		},
	},
});

export const { addStart, addSuccess, addFailure } = productAddReducer.actions;

// Admin add
export const productEditReducer = createSlice({
	name: 'productEdit',
	initialState: {
		success: false,
		loading: false,
		error: false,
	},

	reducers: {
		editStart: state => {
			state.product = {};
			state.loading = true;
		},
		editSuccess: state => {
			state.loading = false;
			state.success = true;
		},
		editFailure: state => {
			state.loading = false;
			state.error = true;
		},
	},
});

export const { editStart, editSuccess, editFailure } =
	productEditReducer.actions;
