import express from 'express';
const router = express.Router();

import {
	getAllUsers,
	getUser,
	registerUser,
	updateUser,
	deleteUser,
} from '../controllers/userController.js';

import { signup, login } from '../controllers/authController.js';

router.post('/signup', signup);

router.route('/').get(getAllUsers).post(registerUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
