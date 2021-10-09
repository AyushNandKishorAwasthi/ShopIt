import {
  LOGIN_FAIL,  LOGIN_SUCCESS,  LOGIN_REQUEST,
  CLEAR_ERRORS,
  REGISTER_USER_FAIL,  REGISTER_USER_REQUEST,  REGISTER_USER_SUCCESS,
  UPDATE_PASSWORD_FAIL,  UPDATE_PASSWORD_REQUEST,  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  FORGOT_PASSWORD_REQUEST,  FORGOT_PASSWORD_SUCCESS,  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,  NEW_PASSWORD_SUCCESS,  NEW_PASSWORD_FAIL,  LOAD_USER_REQUEST,
  LOAD_USER_FAIL,  LOAD_USER_SUCCESS,
  LOGOUT_SUCCESS,  LOGOUT_FAIL,
  UPDATE_PROFILE_FAIL,  UPDATE_PROFILE_REQUEST,  UPDATE_PROFILE_RESET,  UPDATE_PROFILE_SUCCESS,
  ALL_USERS_FAIL,  ALL_USERS_REQUEST,  ALL_USERS_SUCCESS,
  DELETE_PROFILE_FAIL, DELETE_PROFILE_REQUEST, DELETE_PROFILE_RESET, DELETE_PROFILE_SUCCESS
} from '../constants/authConstants';

export const authReducers = (state = { user: {} }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
    case REGISTER_USER_REQUEST:
      return {
        loading: true,
        logout: false,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
    case LOAD_USER_SUCCESS:
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        logout: true,
        loading: false,
        isAuthenticated: false,
        user: null,
      };

    case LOAD_USER_FAIL:
      return {
        loader: true,
        loading: false,
        isAuthentiated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_PROFILE_RESET:
    case UPDATE_PASSWORD_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const allUsersReducer = (state={},action) => {
  switch(action.type){
    case ALL_USERS_REQUEST:
    return{
      loading:true
     }
    case ALL_USERS_SUCCESS:
    return{ 
      loading:false,
      success:action.payload.success,
      users:action.payload.users,
    }
    case ALL_USERS_FAIL:
    return{ 
      error:action.payload,
    }
    case CLEAR_ERRORS:
    return{ 
      error:null
    }
    default:
      return state;
  }
}



export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST:
    case NEW_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };

    case FORGOT_PASSWORD_FAIL:
    case NEW_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const deleteProfileReducer = (state={},action) => {
  switch (action.type) {
    case DELETE_PROFILE_REQUEST:
      return{
        deleting:false
      };
    case DELETE_PROFILE_SUCCESS:
    return {
      deleting:true,
      message:action.payload.message
    }
    case DELETE_PROFILE_FAIL:
    return {
      deleteError:action.payload
    }
    case DELETE_PROFILE_RESET:
    return {
      deleting:false
    }
    case CLEAR_ERRORS:
    return {
      ...state,
      deleteError:null
    }
    default:
     return state;
  }
}
