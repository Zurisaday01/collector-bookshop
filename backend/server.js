import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// import connection MongoDB
import connectDB from './config/db.js';

// routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

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

app.get('/', (req, res) => {
	res.send('API is running....');
});

app.use(function (req, res, next) {
	res.header(
		'Access-Control-Allow-Methods',
		'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
	);
	res.header('Content-Type', 'application/json;charset=UTF-8');
	res.header('Access-Control-Allow-Credentials', true);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.set('Cache-Control', 'no-store');

	next();
});

// Function to serve all static files
// inside public directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'public/img/products')));
app.use('/images', express.static(path.join(__dirname, 'public/img/users')));

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// 300 request from the same IP in 1 hour = limit request from api
const limiter = rateLimit({
	max: 300,
	window: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});

// url parse update user
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID);
});

// if (process.env.NODE_ENV === 'production') {
// 	const __dirname = path.resolve();
// 	// any route that is not api will be redirected to index.html
// 	app.get('*', (req, res) =>
// 		res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'))
// 	);

// 	app.use(
// 		'/images',
// 		express.static(path.join(__dirname, 'public/img/products'))
// 	);
// 	app.use('/images', express.static(path.join(__dirname, 'public/img/users')));
// 	// set static folder
// 	app.use(express.static(path.join(__dirname, '/frontend/build')));
// } else {
// 	app.get('/', (req, res) => {
// 		res.send('API is running....');
// 	});
// }

// affect all http requests
app.all('*', (req, res, next) => {
	// read the next middleware
	// every next will asume it's an error
	next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error middleware
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;

app.listen(
	port,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold
	)
);

// dotenv => package that automatically loads environment variables from a .env file into the process.env
// morgan =>  is an HTTP request level Middleware
