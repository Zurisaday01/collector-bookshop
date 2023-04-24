import mongoose from 'mongoose';
import Product from './productModel.js';

// ref to product / ref to user
// parents: product &  user
const reviewSchema = mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: [true, 'Review must belong to a product'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Review muct belong to a user'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
		},
		review: {
			type: String,
			required: [true, 'Review can not be empty'],
		},
		createAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtual: true },
		toObject: { virtual: true },
	}
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name photo',
	});
	next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
	const stats = await this.aggregate([
		{
			$match: { product: productId },
		},
		{
			$group: {
				_id: '$product',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' },
			},
		},
	]);

	console.log(stats);

	if (stats.length > 0) {
		await Product.findByIdAndUpdate(productId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating,
		});
	} else {
		// default
		await Product.findByIdAndUpdate(productId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
};

reviewSchema.post('save', function () {
	console.log(this.product);
	this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.review = await this.model.findOne(this.getQuery());

	next();
});

reviewSchema.post(/^findOneAnd/, async function () {
	await this.review.constructor.calcAverageRatings(this.review.product);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
