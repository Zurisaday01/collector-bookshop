import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const signup = catchAsync(async (req, res, next) => {
	// the user cannot register as a admin
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
	});

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.status(201).json({
		status: 'success',
		token,
		data: {
			user: newUser,
		},
	});
});

export const login = (req, es, next) => {
	const { email, password } = req.body;

	// 1. check if email and password exist
	if (!email || !password) {
		next(new AppError('Please provide email and password!', 400));
	}
	// 2. Check if user exists && password is corrent

	// 3. if everything is ok, send token to client
	const token = '';
	res.status(200).json({
		status: 'success',
		token,
	});
};
