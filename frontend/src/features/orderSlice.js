import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOrders = createAsyncThunk('fetchOrders', async () => {
	try {
		const { data } = await axios.get('/api/orders', {
			withCredentials: true,
		});

		return data.data.orders;
	} catch (error) {
		console.error(error);
	}
});

export const fetchAllOrders = createAsyncThunk('fetchAllOrders', async () => {
	try {
		const { data } = await axios.get('/api/orders/admin', {
			withCredentials: true,
		});

		return data.data.orders;
	} catch (error) {
		console.error(error);
	}
});

export const fetchOrder = createAsyncThunk('fetchOrder', async id => {
	try {
		const { data } = await axios.get(`/api/orders/${id}`, {
			withCredentials: true,
		});

		return data.data.order;
	} catch (error) {
		console.error(error);
	}
});

export const createOrderReducer = createSlice({
	name: 'orderCreate',
	initialState: {
		order: null,
		loading: false,
		error: false,
		success: false,
		test: false,
	},

	reducers: {
		orderStart: state => {
			state.loading = true;
			state.success = false;
		},
		orderSuccess: (state, action) => {
			state.loading = false;
			state.success = true;
			state.order = action.payload;
			state.test = true;
		},
		orderFailure: state => {
			state.loading = false;
			state.error = true;
			state.success = false;
		},
		orderReset: state => {
			state.order = null;
			state.loading = false;
			state.error = false;
			state.success = false;
		},
	},
});

export const { orderStart, orderSuccess, orderFailure, orderReset } =
	createOrderReducer.actions;

export const orderDetailsReducer = createSlice({
	name: 'order',
	initialState: {
		order: {},
		isLoading: false,
		success: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchOrder.pending, state => {
				state.isLoading = true;
				state.success = false;
			})
			.addCase(fetchOrder.fulfilled, (state, action) => {
				state.order = action.payload;
				state.isLoading = false;
				state.hasError = false;
				state.success = true;
			})
			.addCase(fetchOrder.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
				state.success = false;
			});
	},
	reducers: {
		orderPayUpdate: (state, action) => {
			state.order = action.payload;
			state.isLoading = false;
			state.hasError = false;
		},
		orderPayReset: state => {
			state.order = {};
		},
		orderDeliverUpdate: (state, action) => {
			state.order = action.payload;
			state.isLoading = false;
			state.hasError = false;
		},
		orderDeliverReset: state => {
			state.order = {};
		},
	},
});

export const {
	orderPayUpdate,
	orderPayReset,
	orderDeliverUpdate,
	orderDeliverReset,
} = orderDetailsReducer.actions;

export const orderPayReducer = createSlice({
	name: 'orderPay',
	initialState: {
		loading: false,
		success: false,
		error: false,
	},
	reducers: {
		orderPayStart: state => {
			state.loading = true;
		},
		orderPaySuccess: state => {
			state.loading = false;
			state.success = true;
		},
		orderPayFailure: state => {
			state.loading = false;
			state.error = true;
			state.success = false;
		},
		loadingReset: state => {
			state.loading = false;
		},
	},
});
export const { orderPayStart, orderPaySuccess, orderPayFailure, loadingReset } =
	orderPayReducer.actions;

export const orderDeliverReducer = createSlice({
	name: 'orderPay',
	initialState: {
		loading: false,
		success: false,
		error: false,
	},
	reducers: {
		orderDeliverStart: state => {
			state.loading = true;
		},
		orderDeliverSuccess: state => {
			state.loading = false;
			state.success = true;
		},
		orderDeliverFailure: state => {
			state.loading = false;
			state.error = true;
			state.success = false;
		},
		loadingReset: state => {
			state.loading = false;
		},
	},
});
export const { orderDeliverStart, orderDeliverSuccess, orderDeliverFailure } =
	orderDeliverReducer.actions;

export const orderListReducer = createSlice({
	name: 'orders',
	initialState: {
		orders: [],
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchOrders.pending, state => {
				state.orders = [];
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.orders = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const allOrdersListReducer = createSlice({
	name: 'allOrders',
	initialState: {
		orders: [],
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchAllOrders.pending, state => {
				state.orders = [];
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchAllOrders.fulfilled, (state, action) => {
				state.orders = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchAllOrders.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});
