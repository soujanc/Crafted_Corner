import axios from "axios";
axios.defaults.baseURL = "http://localhost:5001";
axios.defaults.withCredentials = true;

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer function to manage state updates based on different actions
export const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
        isAuthenticated: true,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialState,
        isAuthenticated: false,
        user: null, // Reset state on logout
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: Boolean(action.payload),
      };
    default:
      return state;
  }
};

// Action Creators
export const loginUser = async (dispatch, authData) => {
  dispatch({ type: "AUTH_REQUEST" });

  try {
    console.log("Login Attempt - User Data:", authData);
    const { email, password } = authData; // ✅ Correctly extract email & password
    const response = await axios.post("/api/users/login", { email, password });

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: response.data.user.user, // No need to store token
      },
    });

    return response.data;
  } catch (error) {
    console.log(
      "Login Error:",
      error.response?.data?.message || "Login failed",
    );

    dispatch({
      type: "AUTH_FAILURE",
      payload: error.response?.data?.message || "Login failed",
    });

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

export const signupUser = async (dispatch, authData) => {
  dispatch({ type: "AUTH_REQUEST" });

  try {
    const { email, password, confirmpassword } = authData; // ✅ Correctly extract email, password, and confirmpassword
    const response = await axios.post("/api/users/signup", {
      email,
      password,
      confirmpassword,
    });

    dispatch({
      type: "SIGNUP_SUCCESS",
      payload: {
        user: response.data.user, // No need to store token
      },
    });

    return response.data;
  } catch (error) {
    console.log(
      "Login Error:",
      error.response?.data?.message || "Login failed",
    );
    dispatch({
      type: "AUTH_FAILURE",
      payload: error.response?.data?.message || "Signup failed",
    });
    return {
      success: false,
      message: error.response?.data?.message || "Failed to register",
    };
  }
};

export const logoutUser = async (dispatch) => {
  try {
    await axios.get("/api/users/logout");

    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error("Logout failed", error);
    // Optional: Dispatch an error action if you want to handle logout failure
  }
};

export const fetchCurrentUser = async (dispatch) => {
  try {
    const response = await axios.get("/api/users/current-user");

    if (!response.data || response.data.userId === null) {
      dispatch({ type: "LOGOUT" }); // Clear user state
      return null; // Return null without throwing an error
    }

    dispatch({
      type: "SET_USER",
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch({ type: "LOGOUT" }); // Ensure user state is cleared
      return null; // Return null instead of throwing
    }
    console.error("Error fetching user:", error);
    return null; // Prevents UI crashes
  }
};

export const userAuthActions = (dispatch) => {
  return {
    loginUser: (authData) => loginUser(dispatch, authData),
    signupUser: (authData) => signupUser(dispatch, authData),
    logoutUser: () => logoutUser(dispatch),
    fetchCurrentUser: () => fetchCurrentUser(dispatch), // This is now correct
  };
};
