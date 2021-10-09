import {
  LOGIN_REQUEST,  LOGIN_SUCCESS,  LOGIN_FAIL,
  CLEAR_ERRORS,
  REGISTER_USER_REQUEST,  REGISTER_USER_SUCCESS,  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,  LOAD_USER_FAIL,  LOAD_USER_SUCCESS,  
  LOGOUT_SUCCESS, LOGOUT_FAIL,
  FORGOT_PASSWORD_REQUEST,  FORGOT_PASSWORD_SUCCESS,  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,  NEW_PASSWORD_SUCCESS,  NEW_PASSWORD_FAIL,
  UPDATE_PROFILE_REQUEST,  UPDATE_PROFILE_SUCCESS,  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,  UPDATE_PASSWORD_SUCCESS,  UPDATE_PASSWORD_FAIL,
  ALL_USERS_FAIL,  ALL_USERS_REQUEST,  ALL_USERS_SUCCESS,
  DELETE_PROFILE_FAIL, DELETE_PROFILE_REQUEST, DELETE_PROFILE_SUCCESS
} from '../constants/authConstants';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post('/api/v1/login', { email, password }, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user,
    });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await axios.post('/api/v1/register', userData, config);
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data.user,
    });
  } catch (err) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    const { data } = await axios.get('/api/v1/me');
    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user,
    });
  } catch (err) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const logOutUser = () => async (dispatch) => {
  try {
    await axios.get('/api/v1/logout');
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const { data } = await axios.put('/api/v1/updateMe', userData, config);
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const updatePassword = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post('/api/v1/updatePassword', userData, config);
    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const forgotPassword = (userData) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post('/api/v1/forgotPassword', userData, config);
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (err) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const resetPassword = (token, passwordData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`/api/v1/resetPassword/${token}`, passwordData, config);
    console.log(data);
    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: err.response.data.message,
    });
  }
};

export const getAllUsers = () => async dispatch=>{
  try {
    dispatch({type:ALL_USERS_REQUEST})
    const {data}=await axios.get('/api/v1/admin/allUsers')
    dispatch({
      type:ALL_USERS_SUCCESS,
      payload:data
    })
  } catch (err) {
    dispatch({
      type:ALL_USERS_FAIL,
      payload:err.response.data.message,
    })
  }
}

export const deleteUser = (userId) => async dispatch=>{
  try {
       dispatch({
      type:DELETE_PROFILE_REQUEST
    })
    const {data} = await axios.delete(`/api/v1/admin/user/${userId}`)
    dispatch({
      type:DELETE_PROFILE_SUCCESS,
      payload:data
    })
  } catch (err) {
    dispatch({
      type:DELETE_PROFILE_FAIL,
      payload:err.response.data.message
    })
  }
}



export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
