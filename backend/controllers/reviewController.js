import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// @route	GET /api/reviews
export const getAllReviews = catchAsync(async (req, res, next) => {
	let filter = {};

	if (req.params.productId) filter = { product: req.params.productId };

	const reviews = await Review.find(filter);

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data: {
			reviews,
		},
	});
});

// @route   GET /api/reviews/:id
export const getReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(new AppError('No review found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			review,
		},
	});
});

// @route	POST /api/reviews
export const createReview = catchAsync(async (req, res, next) => {
	// Allow nested routes
	if (!req.body.user) req.body.user = req.user.id;

	const newReview = await Review.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			product: newReview,
		},
	});
});

// @route	PUT /api/reviews/:id
export const updateReview = catchAsync(async (req, res, next) => {
	const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!review) {
		return next(new AppError('No review found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			review,
		},
	});
});

// @route	DELETE /api/reviews/:id
export const deleteReview = catchAsync(async (req, res, next) => {
	const review = await Review.findByIdAndDelete(req.params.id);

	if (!review) {
		return next(new AppError('No review found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
