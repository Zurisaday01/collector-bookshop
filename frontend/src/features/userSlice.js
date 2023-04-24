// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const signUpUser = createAsyncThunk(
// 	'signUpUser',
// 	async ({ name, email, password, passwordConfirm }) => {
// 		try {
// 			const { data } = await axios.post(
// 				'http://localhost:5000/api/users/signup',
// 				{
// 					name: name,
// 					email: email,
// 					password: password,
// 					passwordConfirm: passwordConfirm,
// 				}
// 			);

// 			return data.data;
// 		} catch (error) {
// 			console.error(error.response);
// 		}
// 	}
// );

// export const cartReducer = createSlice({
// 	name: 'user',
// 	initialState: {
// 		user: {},
// 		isLoading: false,
// 		hasError: false,
// 	},
// 	extraReducers: builder => {
// 		builder
// 			.addCase(signUpUser.pending, state => {
// 				state.user;
// 			})
// 			.addCase(signUpUser.fulfilled, (state, action) => {})
// 			.addCase(signUpUser.rejected, (state, action) => {
// 				state.error = action.payload;
// 			});
// 	},
// 	reducers: {
// 		// input: id
// 		removeFromCart: (state, action) => {
// 			const removeItem = state.cartItems.filter(
// 				item => item._id !== action.payload
// 			);
// 			state.cartItems = removeItem;
// 		},
// 	},
// });

// export const { removeFromCart } = cartReducer.actions;
