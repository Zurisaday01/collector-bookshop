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
} from '../controllers/userController.js';

import {
	protect,
	signup,
	signin,
	forgotPassword,
	resetPassword,
	updatePassword,
} from '../controllers/authController.js';

router.post('/signup', signup);
router.post('/signin', signin);

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

router.route('/').get(getAllUsers).post(registerUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
