import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A book must have a name'],
			unique: true,
			trim: true,
		},
		image: {
			type: String,
			default: 'no-image.png',
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
		ratingsAverage: {
			type: Number,
			required: true,
			default: 4.5,
			min: [1, 'Rating must be above 1.0'],
			max: [5, 'Rating must be below 5.0'],
			set: val => Math.round(val * 10) / 10,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		reviewsQuantity: {
			type: Number,
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
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

productSchema.index({ price: 1 });

// virtual populate
// molule we want to reference
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id',
});

const Product = mongoose.model('Product', productSchema);

export default Product;
