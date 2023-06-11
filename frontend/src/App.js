import { useState } from 'react';
// route
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// styles
import './assets/scss/style.scss';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// screens
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import AddedToCartScreen from './screens/AddedToCartScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

// admin
import Sidebar from './screens/admin/Sidebar';
import Dashboard from './screens/admin/Dashboard';
import UsersList from './screens/admin/UsersList';
import ProductsList from './screens/admin/ProductsList';
import OrdersList from './screens/admin/OrdersList';
import Protected from './screens/admin/Protected';
import RedirectHome from './screens/admin/RedirectHome';
import UserAdd from './screens/admin/UserAdd';
import UserEdit from './screens/admin/UserEdit';
import ProductAdd from './screens/admin/ProductAdd';
import ProductEdit from './screens/admin/ProductEdit';
import OrderEdit from './screens/admin/OrderEdit';
import OrderItems from './screens/admin/OrderItems';
import ReviewsList from './screens/admin/ReviewsList';
import CreateReviewScreen from './screens/CreateReviewScreen';
import UpdateReviewScreen from './screens/UpdateReviewScreen';

function App() {
	const categories = [
		'All books',
		'Fantasy',
		'Fiction',
		'Romance',
		'Mystery',
		'Thriller',
		'Contemporary',
		'Historical Fiction',
		'Sports',
		'Non-fiction',
	];
	const [selectedCategory, setSelectedCategory] = useState();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isPhotoUpdated, setIsPhotoUpdated] = useState(false);

	return (
		<BrowserRouter>
			<Navbar
				setSelectedCategory={setSelectedCategory}
				setIsAdmin={setIsAdmin}
				isPhotoUpdated={isPhotoUpdated}
				setIsPhotoUpdated={setIsPhotoUpdated}
			/>
			<Sidebar />
			<Routes>
				<Route
					path='/'
					element={
						<RedirectHome isAdmin={isAdmin}>
							<HomeScreen
								setSelectedCategory={setSelectedCategory}
								categoriesOptions={categories}
							/>
						</RedirectHome>
					}
				/>
				<Route
					path='/shop'
					element={
						<ShopScreen
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
							categoriesOptions={categories}
						/>
					}
				/>
				<Route path='/product/:id' element={<ProductScreen />} />
				<Route
					path='/product/:productId/createReview'
					element={<CreateReviewScreen />}
				/>
				<Route path='/review/:id' element={<UpdateReviewScreen />} />
				<Route path='/cart' element={<CartScreen />} />
				<Route path='/cart/:id?' element={<AddedToCartScreen />} />
				<Route path='/register' element={<SignUpScreen />} />
				<Route path='/forgotPassword' element={<ForgotPasswordScreen />} />
				<Route path='/resetPassword/:token' element={<ResetPasswordScreen />} />
				<Route path='/signin' element={<SignInScreen />} />
				<Route
					path='/profile'
					element={
						<ProfileScreen
							isPhotoUpdated={isPhotoUpdated}
							setIsPhotoUpdated={setIsPhotoUpdated}
						/>
					}
				/>
				<Route path='/shipping' element={<ShippingScreen />} />
				<Route path='/payment' element={<PaymentScreen />} />
				<Route path='/placeorder' element={<PlaceOrderScreen />} />
				<Route path='/order/:id' element={<OrderScreen />} />
				<Route path='/order/:id' element={<OrderScreen />} />

				<Route
					path='/admin'
					element={
						<Protected isAdmin={isAdmin}>
							<Dashboard />
						</Protected>
					}
				/>
				<Route
					path='/admin/users'
					element={
						<Protected isAdmin={isAdmin}>
							<UsersList />
						</Protected>
					}
				/>
				<Route
					path='/admin/users/add'
					element={
						<Protected isAdmin={isAdmin}>
							<UserAdd />
						</Protected>
					}
				/>
				<Route
					path='/admin/users/edit/:id'
					element={
						<Protected isAdmin={isAdmin}>
							<UserEdit />
						</Protected>
					}
				/>
				<Route
					path='/admin/products'
					element={
						<Protected isAdmin={isAdmin}>
							<ProductsList />
						</Protected>
					}
				/>
				<Route
					path='/admin/products/edit/:id'
					element={
						<Protected isAdmin={isAdmin}>
							<ProductEdit />
						</Protected>
					}
				/>
				<Route
					path='/admin/products/add'
					element={
						<Protected isAdmin={isAdmin}>
							<ProductAdd />
						</Protected>
					}
				/>
				<Route
					path='/admin/orders'
					element={
						<Protected isAdmin={isAdmin}>
							<OrdersList />
						</Protected>
					}
				/>
				<Route
					path='/admin/orders/edit'
					element={
						<Protected isAdmin={isAdmin}>
							<OrderEdit />
						</Protected>
					}
				/>
				<Route
					path='/admin/orders/order/:id'
					element={
						<Protected isAdmin={isAdmin}>
							<OrderItems />
						</Protected>
					}
				/>
				<Route
					path='/admin/reviews'
					element={
						<Protected isAdmin={isAdmin}>
							<ReviewsList />
						</Protected>
					}
				/>
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
