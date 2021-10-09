import React, { Fragment, useState, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, loadUser, clearErrors } from '../../actions/authActions';
import { UPDATE_PROFILE_RESET } from '../../constants/authConstants';

const UpdateProfile = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('/images/default.jpg');
  const alert = useAlert();
  const dispatch = useDispatch(); // to call action
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isUpdated, error, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }
    if (isUpdated) {
      alert.success('Data updated successfully');
      dispatch(loadUser());
      history.push('/me');
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
    if (error) {
      alert.error(error);
    }
    return () => dispatch(clearErrors());
  }, [dispatch, alert, error, history, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('avatar', avatar);
    dispatch(updateProfile(formData));
  };
  const onChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={isAuthenticated ? 'Update Profile' : 'Only the excellent products'} />
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" encType="multipart/form-data" method="POST" onSubmit={submitHandler}>
                <h1 className="mt-2 mb-5">Update Profile</h1>

                <div className="form-group">
                  <label htmlFor="email_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="avatar_upload">Avatar</label>
                  <div className="d-flex align-items-center">
                    <div>
                      <figure className="avatar mr-3 item-rtl">
                        <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
                      </figure>
                    </div>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="avatar"
                        className="custom-file-input"
                        id="customFile"
                        accept="image/*"
                        onChange={onChange}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        Choose Avatar
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                  Update
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
