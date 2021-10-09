import React, { Fragment } from 'react';
import { Route, Link, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logOutUser } from '../../actions/authActions';
import Search from './Search';
function Header() {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const logOutHandler = () => {
    dispatch(logOutUser());
    alert.success('Logged out successfully');
    history.replace();
    return <Redirect push to='/'/>
  };

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <Link to="/">
            <div className="navbar-brand">
              <img src="./images/shopit_logo.png" alt="ShopIt" />
            </div>
          </Link>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Route render={({ history }) => <Search history={history} />} />
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              {cartItems.reduce((acc, item) => item.quantity + acc, 0)}
            </span>
          </Link>
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="#!"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img src={user.avatar && user.avatar.url} className="rounded-circle" alt="" />
                </figure>
                <span>{user && user.name.split(' ')[0]}</span>
              </Link>
              <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                {user && user.role === 'admin' && (
                  <Link className="dropdown-item" to="/dashboard">
                    Dashboard
                  </Link>
                )}
                <Link className="dropdown-item" to="/orders/me">
                  Orders
                </Link>
                <Link className="dropdown-item" to="/me">
                  Profile
                </Link>
                <button className="dropdown-item text-danger" onClick={logOutHandler}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            !isAuthenticated && (
              <Link to="/login" className="btn ml-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
}

export default Header;
