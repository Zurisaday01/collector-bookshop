import express from 'express';
import multer from 'multer';
const router = express.Router();

import {
	uploadUserPhoto,
	resizeUserPhoto,
	yourProfile,
	updateUserProfile,
	deleteUserProfile,
	getAllUsers,
	getUser,
	registerUser,
	updateUser,
	deleteUser,
	createUser,
} from '../controllers/userController.js';

import {
	protect,
	restrictTo,
	signup,
	signin,
	logout,
	forgotPassword,
	resetPassword,
	updatePassword,
} from '../controllers/authController.js';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/logout', logout);

router.post('/create', protect, restrictTo('admin'), createUser);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.get('/yourProfile', protect, yourProfile, getUser);

router.patch(
	'/updateProfile',
	protect,
	uploadUserPhoto,
	resizeUserPhoto,
	updateUserProfile
);

router.delete('/deleteProfile', protect, deleteUserProfile);

router
	.route('/')
	.get(protect, restrictTo('admin'), getAllUsers)
	.post(registerUser);

router
	.route('/:id')
	.get(getUser)
	.patch(protect, restrictTo('admin'), updateUser)
	.delete(protect, restrictTo('admin'), deleteUser);

export default router;
