import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
	productListReducer,
	productDetailsReducer,
	productDeleteReducer,
	productCreateReducer,
	productAddReducer,
	productEditReducer,
} from '../features/productSlice.js';
import { cartReducer } from '../features/cartSlice.js';
import {
	userReducer,
	usersListReducer,
	userDeleteReducer,
	userCreateReducer,
	userDetailsReducer,
	userEditReducer,
} from '../features/userSlice';
import {
	createOrderReducer,
	orderDetailsReducer,
	orderPayReducer,
	orderDeliverReducer,
	orderListReducer,
	allOrdersListReducer,
} from '../features/orderSlice.js';

import {
	reviewListReducer,
	createReviewReducer,
	reviewDetailsReducer,
	reviewEditReducer,
	reviewDeleteReducer,
} from '../features/reviewSlice.js';
// redux persist
import storage from 'redux-persist/lib/storage';

import { combineReducers } from '@reduxjs/toolkit';

import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';

const persistConfig = {
	key: 'root',
	version: 1,
	whitelist: ['cart', 'user', 'orderCreate', 'orderDetails', 'orderPay'],
	storage,
};

const rootReducer = combineReducers({
	productList: productListReducer.reducer,
	productDetails: productDetailsReducer.reducer,
	productDelete: productDeleteReducer.reducer,
	productCreate: productCreateReducer.reducer,
	productAdd: productAddReducer.reducer,
	productEdit: productEditReducer.reducer,
	cart: cartReducer.reducer,
	user: userReducer.reducer,
	usersList: usersListReducer.reducer,
	userDetails: userDetailsReducer.reducer,
	userAdminDelete: userDeleteReducer.reducer,
	userAdminCreate: userCreateReducer.reducer,
	userAdminEdit: userEditReducer.reducer,
	orderCreate: createOrderReducer.reducer,
	orderDetails: orderDetailsReducer.reducer,
	orderPay: orderPayReducer.reducer,
	orderDeliver: orderDeliverReducer.reducer,
	orderList: orderListReducer.reducer,
	ordersAllList: allOrdersListReducer.reducer,
	createReview: createReviewReducer.reducer,
	reviewDetails: reviewDetailsReducer.reducer,
	reviewEdit: reviewEditReducer.reducer,
	reviewList: reviewListReducer.reducer,
	reviewDelete: reviewDeleteReducer.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export default store;
