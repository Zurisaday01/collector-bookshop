import mongoose from 'mongoose';

// review
const reviewSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: String,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// product

const productSchema = mongoose.Schema(
	{
		// user: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	required: true,
		// 	ref: 'User',
		// },
		name: {
			type: String,
			required: [true, 'A book must have a name'],
			unique: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		category: {
			type: Array,
			required: true,
		},
		description: {
			type: String,
			required: true,
			minlength: [
				200,
				'A description book must have more or equal than 200 characters',
			],
		},
		reviews: [reviewSchema],
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		numReviews: {
			type: Number,
			required: true,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
		},
		countInStock: {
			type: Number,
			required: true,
			default: 0,
		},
		bestseller: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
