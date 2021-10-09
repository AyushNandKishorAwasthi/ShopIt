import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';

import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, clearErrors } from '../../actions/authActions';
import { UPDATE_PASSWORD_RESET } from '../../constants/authConstants';

const UpdatePassword = ({ history }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const alert = useAlert();
  const dispatch = useDispatch(); // to call action
  const { isUpdated, error, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector(state=>state.auth);
  useEffect(() => {
    if (isUpdated) {
      alert.success('Password updated successfully');
      history.push('/me');
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, history, error, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('oldPassword', oldPassword);
    formData.set('newPassword', newPassword);
    formData.set('confirmPassword', confirmPassword);
    dispatch(updatePassword(formData));
  };

  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Update Password" : 'Only the excellent products'} 
       />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_new_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_new_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdatePassword;
