import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all users
// @route	GET /api/users
export const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find({});

	res.status(200).json({
		status: 'success',
		data: {
			users,
		},
	});
});

// @desc    Get user by ID
// @route   GET /api/users/:id
export const getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new AppError('No user found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
});

// @desc    Register a new user
// @route	POST /api/users
export const registerUser = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});

// @desc    Update user
// @route	PUT /api/users:id
export const updateUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return next(new AppError('No user found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
});

// @desc    Delete user
// @route	DELETE /api/users/:id
export const deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(new AppError('No user found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
