import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';
import sharp from 'sharp';

import User from '../models/userModel.js';

const multerStorage = multer.memoryStorage();

const multerFileter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new AppError('Not an image! Please upload only images.', 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFileter,
});

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = (req, file, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

	sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`backend/public/img/users/${req.file.filename}`);

	next();
};

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};

	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});

	return newObj;
};

// middleware
export const yourProfile = catchAsync(async (req, res, next) => {
	req.params.id = req.user.id;
	next();
});

export const updateUserProfile = catchAsync(async (req, res, next) => {
	// create error if user tries to POST password or passwordConfirm
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword',
				400
			)
		);
	}

	// filter the req.body {}, to return req.body{'name', 'email'}
	const filteredBody = filterObj(req.body, 'name', 'email');

	if (req.file) filteredBody.photo = req.file.filename;
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

// @desc	We are not deleting users, we are marking them as inactive
// @route	POST /api/users
// @access	Public/User
export const deleteUserProfile = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

// @desc    Get all users
// @route	GET /api/users
// @access	Private/Admin
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
			user,
		},
	});
});

// @desc    Register a new user
// @route	POST /api/users
// @access	Public/User
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
// @route	PATCH /api/users:id
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
// @access	Private/Admin
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

// @desc    Create user
// @route	POST /api/users/
// @access	Private/Admin
export const createUser = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		photo: req.body.photo,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role,
		active: req.body.active,
		passwordChangedAt: req.body.passwordChangedAt,
		passwordResetToken: req.body.passwordResetToken,
		passwordResetExpires: req.body.passwordResetExpires,
	});

	res.status(201).json({
		status: 'success',
		data: {
			user: newUser,
		},
	});
});
