import crypto from 'crypto';
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please tell us your name!'],
		ref: 'User',
	},
	email: {
		type: String,
		required: [true, 'Please provide your email'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a valid email!'],
	},
	photo: {
		type: String,
		default: 'default.png',
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Provide a password'],
		minlengh: 6,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// This only works on create and save
			validator: function (e) {
				return e == this.password;
			},
			message: 'Passwords are not the same!',
		},
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

// middlewares
userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	// there is a little delay
	this.passwordChangedAt = Date.now() - 1000;

	next();
});

userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	// delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

// show all documents (users) that don't have active: false == active: true by default
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.correctPassword = async function (
	inputPassword,
	userPassword
) {
	//kazi299 === $2a$12$vkEYIuCtZgUwymAVm3ZIgek9ll/aj1yRuPsuUxnzqsSFEq.YuFyNy

	return await bcrypt.compare(inputPassword, userPassword);
};

// user created = token issued
userSchema.methods.changedPasswordAfterUserCreated = function (tokenTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return changedTimestamp > tokenTimestamp;
	}

	// it means the password didn't change
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// 10 minutes to change the password
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
