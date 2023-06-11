import Product from '../models/productModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';
import sharp from 'sharp';

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

export const uploadProductPhoto = upload.single('image');

export const resizeProductPhoto = (req, file, next) => {
	if (!req.file) return next();

	req.file.filename = `product-${req.params.id}-${Date.now()}.jpeg`;

	sharp(req.file.buffer)
		.resize(333, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`backend/public/img/products/${req.file.filename}`);

	next();
};

// @route	GET /api/products
export const getAllProducts = catchAsync(async (req, res, next) => {
	const products = await Product.find({});

	res.status(200).json({
		status: 'success',
		products,
	});
});

// @route   GET /api/products/:id
export const getProduct = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.id).populate('reviews');

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

// @desc    Create product
// @route	POST /api/products
// @access	Private/Admin
export const createProduct = catchAsync(async (req, res, next) => {
	const bodyProduct = {
		...req.body,
		category: JSON.parse(req.body.category),
	};

	const newProduct = await Product.create(bodyProduct);

	res.status(201).json({
		status: 'success',
		data: {
			product: newProduct,
		},
	});
});

// @route	PATCH /api/products/:id
export const updateProduct = catchAsync(async (req, res, next) => {
	const bodyProduct = req.file
		? {
				...req.body,
				category: JSON.parse(req.body.category),
				image: req.file.filename,
		  }
		: { ...req.body, category: JSON.parse(req.body.category) };

	const product = await Product.findByIdAndUpdate(req.params.id, bodyProduct, {
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

// @desc    Delete product by id
// @route	DELETE /api/products/:id
// @access	Private/Admin
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
