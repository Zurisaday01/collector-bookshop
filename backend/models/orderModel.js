import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Order must belong to a user'],
	},
	orderItems: [
		{
			name: {
				type: String,
				required: true,
				unique: false,
			},
			image: {
				type: String,
				required: true,
			},
			qty: {
				type: Number,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			_id: {
				type: mongoose.Schema.ObjectId,
				ref: 'Product',
				required: [true, 'Order must belong to a product'],
			},
		},
	],
	shippingAddress: {
		address: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		postalCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	paymentMethod: {
		type: String,
		required: true,
	},
	paymentResult: {
		id: {
			type: String,
		},
		status: {
			type: String,
		},
		update_time: {
			type: String,
		},
		email_address: {
			type: String,
		},
	},
	taxPrice: {
		type: Number,
		required: true,
		default: 0.0,
	},
	shippingPrice: {
		type: Number,
		required: true,
		default: 0.0,
	},
	totalPrice: {
		type: Number,
		required: true,
		default: 0.0,
	},
	isPaid: {
		type: Boolean,
		required: true,
		default: false,
	},
	paidAt: {
		type: Date,
		default: Date.now,
	},
	isDelivered: {
		type: Boolean,
		required: true,
		default: false,
	},
	deliveredAt: {
		type: Date,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});

orderSchema.pre(/^find/, function (next) {
	this.populate('user').populate({
		path: 'orderItems',
		populate: {
			path: '_id',
			model: 'Product',
			select: 'name',
		},
		// select: 'name',
	});

	next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
