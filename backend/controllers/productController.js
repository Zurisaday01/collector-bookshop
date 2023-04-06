import Product from '../models/productModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// @route	GET /api/products
export const getAllProducts = catchAsync(async (req, res, next) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @route   GET /api/products/:id
export const getProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		return next(new AppError('No product found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
});

// @route	POST /api/products
export const createProduct = catchAsync(async (req, res, next) => {
	const newProduct = await Product.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			product: newProduct,
		},
	});
});

// @route	PUT /api/products/:id
export const updateProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!product) {
		return next(new AppError('No product found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			product,
		},
	});
});

// @route	DELETE /api/products/:id
export const deleteProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (!product) {
		return next(new AppError('No product found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
