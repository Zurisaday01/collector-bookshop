import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import path from 'path';
import { fileURLToPath } from 'url';
// const cors = require('cors');
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import connection MongoDB
import connectDB from './config/db.js';

// routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// routes
dotenv.config();

connectDB();

const app = express();

// Implement CORS
app.use(
	cors({
		origin: 'http://localhost:3000',
		optionsSuccessStatus: 200,
		credentials: true,
	})
);

app.use(function (req, res, next) {
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Access-Control-Allow-Credentials', true);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// Function to serve all static files
// inside public directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇️ configure CORS
// app.use(cors({ origin: true, credentials: true }));

// app.options('*', cors());

app.use('/images', express.static(path.join(__dirname, 'public/img/products')));
app.use('/images', express.static(path.join(__dirname, 'public/img/users')));

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// 300 request from the same IP in 1 hour
const limiter = rateLimit({
	max: 300,
	window: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

app.use(express.json());

app.use(cookieParser());
// test middleware
// app.use((req, res, next) => {
// 	// it's an object that contains cookies sent by request in JSON after parsing.
// 	console.log(req.cookies);
// 	next();
// });

// ROUTES
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// affect all http requests
app.all('*', (req, res, next) => {
	// read the next middleware
	// every next will asume it's an error
	next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error middleware
app.use(globalErrorHandler);

// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server running on port ${port}`.yellow.bold));

// dotenv => package that automatically loads environment variables from a .env file into the process.env
// morgan =>  is an HTTP request level Middleware
