import express from 'express';

const router = express.Router({ mergeParams: true });

import {
	getAllReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview,
} from '../controllers/reviewController.js';

import { protect, restrictTo } from '../controllers/authController.js';

// POST /product/12312j31k23hiuhasd2a/reviews
// GET /product/12312j31k23hiuhasd2a/reviews
// POST /reviews
router
	.route('/')
	.get(protect, restrictTo('admin'), getAllReviews)
	.post(protect, restrictTo('user'), createReview);

router
	.route('/:id')
	.get(getReview)
	.patch(protect, restrictTo('user'), updateReview)
	.delete(protect, restrictTo('admin'), deleteReview);

export default router;
