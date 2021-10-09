import './App.css';
import axios from 'axios';
import Home from './Component/Home';
import Cart from './Component/cart/Cart';
import Login from './Component/user/Login';
import { useEffect, useState } from 'react';
import Profile from './Component/user/Profile';
import Header from './Component/layouts/Header';
import Footer from './Component/layouts/Footer';
import Register from './Component/user/Register';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Component/cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import ListOrder from './Component/order/ListOrder';
import OrderDetails from './Component/order/OrderDetails';
import ResetPassword from './Component/user/ResetPassword';
import ConfirmOrder from './Component/cart/ConfirmOrder';
import SuccessOrder from './Component/cart/SuccessOrder';
import ShippingInfo from './Component/cart/ShippingInfo';
import UpdateProfile from './Component/user/UpdateProfile';
import UpdatePassword from './Component/user/UpdatePassword';
import ForgotPassword from './Component/user/ForgotPassword';
import ProductDetails from './Component/product/ProductDetails';
import ProtectedRoute from './Component/routes/protectedRoute';
import Dashboard from './Component/admin/Dashboard';
import ListProducts from './Component/admin/ListProducts';
import OrderAdminDetails from './Component/admin/OrderAdminDetails';
import OrderAdminUpdate from './Component/admin/OrderAdminUpdate';
import ListOrders from './Component/admin/ListOrders';
import NewProduct from './Component/admin/NewProduct';
import UpdateProduct from './Component/admin/UpdateProduct';
import ListUsers from './Component/admin/ListUsers';
import ListReviews from './Component/admin/ListReviews';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Store from './Store';
import { loadUser } from './actions/authActions';
import { useSelector } from 'react-redux';

function App() {
  const [stripeKey, setStripeKey] = useState('');
  const { user, isAuthenticated } = useSelector(state=>state.auth)
  useEffect(() => {
    Store.dispatch(loadUser());
    async function getStripeKey() {
      const { data } = await axios.get('/api/v1/stripeApiKey');
      setStripeKey(data.stripe_Key);
    }
    getStripeKey();
  }, []);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route exact path="/" component={Home} key={1} />
          <Route path="/search/:keyword" component={Home} key={2} />
          <Route exact path="/product/:id" component={ProductDetails} />
          <Route exact path="/login" component={Login} key={4} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/cart" component={Cart} />
          {stripeKey && (
            <Elements stripe={loadStripe(stripeKey)}>
              <ProtectedRoute exact path="/payment" component={Payment} />
            </Elements>
          )}
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/resetPassword/:token" component={ResetPassword} />
          <ProtectedRoute exact path="/me" component={Profile} />
          <ProtectedRoute exact path="/shipping" component={ShippingInfo} />
          <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute exact path="/success" component={SuccessOrder} />
          <ProtectedRoute exact path="/orders/me" component={ListOrder} />
          <ProtectedRoute exact path="/orders/me/:id" component={OrderDetails} />
          <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
          <ProtectedRoute exact path="/password/update" component={UpdatePassword} />
        </div>
        <ProtectedRoute exact path="/dashboard" isAdmin={true} component={Dashboard} />
        <ProtectedRoute exact path="/admin/products" isAdmin={true} component={ListProducts} />
        <ProtectedRoute exact path="/admin/product" isAdmin={true} component={NewProduct} />
        <ProtectedRoute exact path="/admin/product/:id" isAdmin={true} component={UpdateProduct} />
        <ProtectedRoute exact path="/admin/orders" isAdmin={true} component={ListOrders} />
        <ProtectedRoute exact path="/admin/orders/details/:id" isAdmin={true} component={OrderAdminDetails} />
        <ProtectedRoute exact path="/admin/orders/update/:id" isAdmin={true} component={OrderAdminUpdate} />
        <ProtectedRoute exact path="/admin/users" isAdmin={true} component={ListUsers} />
        <ProtectedRoute exact path="/admin/reviews" isAdmin={true} component={ListReviews} />
        {
        !isAuthenticated || user.role!=='admin'?
          <Footer/>:''
        }
      </div>
    </Router>
  );
}

export default App;
