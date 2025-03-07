import React, { useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";

export default function AuthTest() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  // Signup state
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log("Signup Data:", signupData); // Log signup data for debugging
      const response = await signupUser(signupData);

      console.log("Signup Response:", response); // Log response for debugging

      // Clear signup form
      setSignupData({
        email: "",
        password: "",
        confirmpassword: "",
      });

      alert("Signup successful! Please login to continue.");

      // Optional: Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error); // Log full error for debugging
      alert(error.response?.data?.message || "Signup failed");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(loginData);

      // Log the entire response
      console.log("Login Response:", response);

      // Check if response exists and show alert
      if (response) {
        alert(`Login successful! User: ${response.user?.email || "Unknown"}`);

        // Navigate to home page or dashboard
      }
    } catch (error) {
      // Error handling with detailed logging
      console.error("Login Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      alert(error.response?.data?.message || "Login failed");
    }
  };
  const handleLogout = async () => {
    try {
      const response = await logoutUser();

      // Success notification
      alert("Logged out successfully!", response);

      // Navigate to home or login page
    } catch (error) {
      // Error handling
      alert(error.response?.data?.message || "Logout failed");
    }
  };
  const { loginUser, signupUser, logoutUser, fetchCurrentUser } =
    userAuthActions(dispatch);
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        // Log all cookies for debugging
        console.log("All Cookies:", document.cookie);

        // Fetch current user
        const currentUser = await fetchCurrentUser();
        console.log("Current User:", currentUser);
      } catch (error) {
        console.error("Error checking current user:", error);
      }
    };

    checkCurrentUser();
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentication Test
        </h2>
        {/* Logout Button - Conditionally Rendered */}
        {state.isAuthenticated && (
          <div className="mt-4 text-center">
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Signup Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Sign Up
              </h3>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    required
                    value={signupData.confirmpassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmpassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={state.isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {state.isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Login Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Login
              </h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={state.isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {state.isLoading ? "Logging In..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="mt-4 text-center text-sm text-red-600">
              {state.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
