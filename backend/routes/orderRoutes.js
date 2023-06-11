import express from 'express';

const router = express.Router({ mergeParams: true });

import {
	getAllOrders,
	getMyOrders,
	getOrder,
	createOrder,
	updateOrderToPaid,
	updateOrderToDelivered,
	deleteOrder,
} from '../controllers/orderController.js';

import { protect, restrictTo } from '../controllers/authController.js';

router.route('/').get(protect, getMyOrders).post(protect, createOrder);

router.route('/admin').get(protect, restrictTo('admin'), getAllOrders);

router.route('/:id').get(getOrder).delete(protect, deleteOrder);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router
	.route('/:id/deliver')
	.patch(protect, restrictTo('admin'), updateOrderToDelivered);

export default router;
