import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
	productListReducer,
	productDetailsReducer,
} from '../features/productSlice.js';
import { cartReducer } from '../features/cartSlice.js';
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
	whitelist: ['cart'],
	storage,
};

const rootReducer = combineReducers({
	productList: productListReducer.reducer,
	productDetails: productDetailsReducer.reducer,
	cart: cartReducer.reducer,
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
