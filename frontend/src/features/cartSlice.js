import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import axios from 'axios';

export const fetchProductInCart = createAsyncThunk(
	'fetchProductInCart',
	async ({ id, qty }) => {
		try {
			const { data } = await axios.get(
				`http://localhost:5000/api/products/${id}?qty=${qty}`
			);

			const {
				data: { product },
			} = data;

			return { ...product, qty };
		} catch (error) {
			console.error(error);
		}
	}
);

export const cartReducer = createSlice({
	name: 'cart',
	initialState: {
		cartItems: [],
	},
	extraReducers: builder => {
		builder
			.addCase(fetchProductInCart.pending, state => {
				if (!state.cartItems) {
					state.cartItems = [];
				} else {
					state.cartItems = state.cartItems;
				}
			})
			.addCase(fetchProductInCart.fulfilled, (state, action) => {
				// console.log(current(state));
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
		removeFromCart:  (state, action) => {
			const removeItem = state.cartItems.filter(
				item => item._id !== action.payload
			);
			state.cartItems = removeItem;
		},
	},
});

export const { removeFromCart } = cartReducer.actions;

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
