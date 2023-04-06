import express from 'express';

const router = express.Router();

import {
	getAllProducts,
	getProduct,
	deleteProduct,
	createProduct,
	updateProduct,
} from '../controllers/productController.js';

// route handlers
router.route('/').get(getAllProducts).post(createProduct);

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

export default router;
