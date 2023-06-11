import Order from '../models/orderModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getCheckoutSession = async (req, res, next) => {};

// @desc    Get all Orders
// @route	GET /api/orders
// @access	Private/Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
	const orders = await Order.find({});

	res.status(200).json({
		status: 'success',
		results: orders.length,
		data: {
			orders,
		},
	});
});

// @route	GET /api/orders
export const getMyOrders = catchAsync(async (req, res, next) => {
	const orders = await Order.find({ user: req.user._id });

	res.status(200).json({
		status: 'success',
		results: orders.length,
		data: {
			orders,
		},
	});
});

// @desc	Get order by id
// @route   GET /api/orders/:id
export const getOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findById(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order,
		},
	});
});

// @route	POST /api/orders
export const createOrder = catchAsync(async (req, res, next) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		return next(new AppError('No order items', 400));
	}

	const newOrder = await Order.create({ ...req.body, user: req.user.id });

	res.status(201).json({
		status: 'success',
		data: {
			order: newOrder,
		},
	});
});

// @desc Update order to paid
// @route	PUT /api/orders/:id
export const updateOrderToPaid = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that ID', 404));
	}

	// updating
	order.isPaid = true;
	order.paidAt = Date.now();
	// the paymentResult comes from paypal, paypal returns an object when you pay
	order.paymentResult = {
		id: req.body.id,
		status: req.body.status,
		update_time: req.body.update_time,
		email_address: req.body.payer.email_address,
	};

	const updatedOrder = await order.save();

	res.status(200).json({
		status: 'success',
		data: {
			order: updatedOrder,
		},
	});
});

// @desc Update order to deliver
// @route	PATCH /api/orders/:id
export const updateOrderToDelivered = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!order) {
		return next(new AppError('No order found with that ID', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			order: order,
		},
	});
});

// @route	DELETE /api/orders/:id
export const deleteOrder = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndDelete(req.params.id);

	if (!order) {
		return next(new AppError('No order found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});
