import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductInCart = createAsyncThunk(
	'fetchProductInCart',
	async ({ id, qty }) => {
		try {
			const { data } = await axios.get(`/api/products/${id}?qty=${qty}`);

			const {
				data: { product },
			} = data;

			return { ...product, qty };
		} catch (error) {
			console.error(error.message);
		}
	}
);

export const cartReducer = createSlice({
	name: 'cart',
	initialState: {
		cartItems: [],
		loading: false,
		shippingAddress: null,
		paymentMethod: null,
		order: null,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchProductInCart.pending, state => {
				state.loading = true;
				if (!state.cartItems) {
					state.cartItems = [];
				} else {
					state.cartItems = state.cartItems;
				}
			})
			.addCase(fetchProductInCart.fulfilled, (state, action) => {
				// console.log(current(state));
				state.loading = false;

				const item = action.payload;
				// is the item already exits in the cart
				const existItem = state.cartItems.find(x => x._id === item._id);

				if (existItem) {
					//  id the item exists then update, if not add new item
					// state.cartItems.map(x => (x._id === existItem._id ? item : x));

					state.cartItems.forEach((book, idx) => {
						if (book._id === existItem._id) {
							state.cartItems[idx] = item;
						}
					});
				} else {
					state.cartItems.push({ ...item });
				}
			})
			.addCase(fetchProductInCart.rejected, (state, action) => {
				state.error = action.payload;
			});
	},
	reducers: {
		// input: id
		removeFromCart: (state, action) => {
			const removeItem = state.cartItems.filter(
				item => item._id !== action.payload
			);
			state.cartItems = removeItem;
		},
		getShippingAddress: (state, action) => {
			state.shippingAddress = action.payload;
		},
		getPaymentMethod: (state, action) => {
			state.paymentMethod = action.payload;
		},
		getOrderSumary: (state, action) => {
			state.order = action.payload;
		},
		cartReset: state => {
			state.cartItems = [];
			state.shippingAddress = null;
			state.paymentMethod = null;
			state.order = null;
		},
		cartClean: state => {
			state.cartItems = [];
		},
	},
});

export const {
	removeFromCart,
	getShippingAddress,
	getPaymentMethod,
	getOrderSumary,
	cartReset,
	cartClean,
} = cartReducer.actions;

// const initialState = () => ({
// 	cartItems: [],
// });

// export const cartReducer = createSlice({
// 	name: 'cart',
// 	initialState: initialState(),

// 	reducers: {
// 		addToCart: (state, action) => {},

// 		// eslint-disable-next-line no-undef
// 		reset: () => initialState(),
// 	},
// });

// export const { reset } = cartReducer.actions;
