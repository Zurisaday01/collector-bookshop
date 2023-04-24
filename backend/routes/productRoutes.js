import express from 'express';

const router = express.Router();

import {
	uploadProductPhoto,
	resizeProductPhoto,
	getAllProducts,
	getProduct,
	deleteProduct,
	createProduct,
	updateProduct,
} from '../controllers/productController.js';

import { protect, restrictTo } from '../controllers/authController.js';

import reviewRouter from './reviewRoutes.js';

// if you have an url like this, then use the reviewRouter
router.use('/:productId/reviews', reviewRouter);

// route handlers
router
	.route('/')
	.get(getAllProducts)
	.post(protect, restrictTo('admin'), createProduct);

router
	.route('/:id')
	.get(getProduct)
	.patch(
		protect,
		restrictTo('admin'),
		uploadProductPhoto,
		resizeProductPhoto,
		updateProduct
	)
	.delete(protect, restrictTo('admin'), deleteProduct);

export default router;
