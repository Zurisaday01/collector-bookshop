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
	},
	password: {
		type: String,
		required: [true, 'Provide a password'],
		minlengh: 6,
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
});

userSchema.pre('save', async function (next) {
	// if password was modified
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);

	// delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', userSchema);

export default User;
