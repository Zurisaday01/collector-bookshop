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

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomeScreen />} />
				<Route path='/shop' element={<ShopScreen />} />
				<Route path='/product/:id' element={<ProductScreen />} />
				<Route path='/cart' element={<CartScreen />} />
				<Route path='/cart/:id?' element={<AddedToCartScreen />} />
				<Route path='/register' element={<SignUpScreen />} />
				<Route path='/signin' element={<SignInScreen />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
