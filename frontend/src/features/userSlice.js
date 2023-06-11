import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('fetchUsers', async () => {
	try {
		const { data } = await axios.get('/api/users', {
			withCredentials: true,
		});

		return data.data.users;
	} catch (error) {
		console.error(error);
	}
});

export const fetchUser = createAsyncThunk('fetchUser', async id => {
	try {
		const { data } = await axios.get(`/api/users/${id}`, {
			withCredentials: true,
		});

		return data.data.user;
	} catch (error) {
		console.error(error);
	}
});

export const userReducer = createSlice({
	name: 'user',
	initialState: {
		currentUser: null,
		loading: false,
		error: false,
		updating: false,
	},

	reducers: {
		loginStart: state => {
			state.loading = true;
		},
		loginSuccess: (state, action) => {
			state.loading = false;
			state.currentUser = action.payload;
		},
		loginFailure: state => {
			state.loading = false;
			state.error = true;
		},
		logout: state => {
			state.currentUser = null;
			state.loading = false;
			state.error = false;
		},
		updateStart: state => {
			state.updating = true;
		},
		updateUser: (state, action) => {
			state.currentUser = action.payload;
			state.updating = false;
		},
		updatePhoto: (state, action) => {
			state.currentUser = Object.assign({}, state.currentUser, {
				photo: action.payload,
			});
			state.updating = false;
		},
		updateFailure: state => {
			state.updating = false;
			state.error = true;
		},
		deleteAccuntStart: state => {
			state.loading = true;
		},
		deleteAccuntFailure: state => {
			state.loading = false;
			state.error = true;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	updateStart,
	updateUser,
	updatePhoto,
	updateFailure,
	deleteAccuntStart,
	deleteAccuntFailure,
} = userReducer.actions;

export const usersListReducer = createSlice({
	name: 'users',
	initialState: {
		users: [],
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.pending, state => {
				state.users = [];
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.users = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

// Admin delete
export const userDeleteReducer = createSlice({
	name: 'userDelete',
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
	userDeleteReducer.actions;

// Admin create
export const userCreateReducer = createSlice({
	name: 'userCreate',
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
	userCreateReducer.actions;

export const userDetailsReducer = createSlice({
	name: 'user',
	initialState: {
		user: {},
		isLoading: false,
		hasError: false,
	},
	extraReducers: builder => {
		builder
			.addCase(fetchUser.pending, state => {
				state.user = {};
				state.isLoading = true;
				state.hasError = false;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.isLoading = false;
				state.hasError = false;
			})
			.addCase(fetchUser.rejected, (state, action) => {
				state.hasError = true;
				state.isLoading = false;
				state.error = action.payload;
			});
	},
	reducers: {
		userReset: state => {
			state.user = {};
			state.isLoading = false;
			state.hasError = false;
		},
	},
});

export const { userReset } = userDetailsReducer.actions;

// Admin edit
export const userEditReducer = createSlice({
	name: 'userCreate',
	initialState: {
		success: false,
		loading: false,
		error: false,
	},

	reducers: {
		editStart: state => {
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

export const { editStart, editSuccess, editFailure } = userEditReducer.actions;
