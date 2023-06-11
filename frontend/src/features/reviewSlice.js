import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReview = createAsyncThunk('fetchReview', async id => {
	try {
		const { data } = await axios.get(`/api/reviews/${id}`);
		return data.data.review;
	} catch (error) {
		console.error(error);
	}
});

export const fetchReviews = createAsyncThunk('fetchReviews', async () => {
	try {
		const { data } = await axios.get('/api/reviews', {
			withCredentials: true,
		});

		return data.data.reviews;
	} catch (error) {
		console.error(error);
	}
});

export const reviewListReducer = createSlice({
	name: 'reviews',
	initialState: {
		reviews: [],
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchReviews.pending, state => {
				state.reviews = [];
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				state.reviews = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchReviews.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const createReviewReducer = createSlice({
	name: 'createReview',
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
	createReviewReducer.actions;

export const reviewDetailsReducer = createSlice({
	name: 'review',
	initialState: {
		review: {},
		success: false,
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchReview.pending, state => {
				state.review = {};
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchReview.fulfilled, (state, action) => {
				state.review = action.payload;
				state.isLoading = false;
				state.success = true;
			})
			.addCase(fetchReview.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
	reducers: {
		productReset: state => {
			state.review = {};
			state.isLoading = false;
			state.hasError = false;
			state.success = false;
		},
	},
});

export const { productReset } = reviewDetailsReducer.actions;

export const reviewEditReducer = createSlice({
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
	reviewEditReducer.actions;

// Admin delete
export const reviewDeleteReducer = createSlice({
	name: 'reviewDelete',
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
	reviewDeleteReducer.actions;
