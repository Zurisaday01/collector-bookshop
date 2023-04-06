import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// import connection MongoDB
import connectDB from './config/db.js';

// routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

// routes
dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(express.json());

// ROUTES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// affect all http requests
app.all('*', (req, res, next) => {
	// read the next middleware
	// every next will asume it's an error
	next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port}`.yellow.bold));

// dotenv => package that automatically loads environment variables from a .env file into the process.env
// morgan =>  is an HTTP request level Middleware
