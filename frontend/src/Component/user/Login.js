import React, { Fragment, useState, useEffect } from 'react';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../../actions/authActions';
const Login = ({ history, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const alert = useAlert();
  const dispatch = useDispatch(); // to call action

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const { isAuthenticated, loading, error, loader } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) history.push(redirect);
    if (error) {
      if (!loader) alert.error(error); //loader for webtoken and other errors
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error, history, loader, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!loading) dispatch(login(email, password));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Login" />
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Link to="/forgotPassword" className="float-right mb-4">
                  Forgot Password?
                </Link>

                <button id="login_button" type="submit" className="btn btn-block py-3">
                  LOGIN
                </button>

                <Link to="/register" className="float-right mt-3">
                  New User?
                </Link>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
