import React, { useState, useEffect, useContext, useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authReducer, userAuthActions } from "../Reducers/AuthReducer";
import Button from "../components/Buttons/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });
  const { loginUser, signupUser, logoutUser, fetchCurrentUser } =
    userAuthActions(dispatch);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(
    searchParams.get("signup") === "true",
  );
  const [isForgotPassword, setIsForgotPassword] = useState(
    searchParams.get("forgot") === "true",
  );
  const [type, setType] = useState("password");
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [SignupErrors, setSignupErrors] = useState({
    //all the error variables
    email: "",
    password: "",
    confirmpassword: "",
    general: "",
  });
  const [LoginErrors, setLoginErrors] = useState({
    //all the error variables
    email: "",
    password: "",
    general: "",
  });
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  // Helper validation functions that validate input values
  const validateField = (name, value, additionalParams = {}) => {
    // First, check if the field is empty

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        const passwordRegex =
          /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])(?=.*[0-9a-zA-Z]).{8,}$/;
        return !passwordRegex.test(value)
          ? "Minimum 8 characters long and 1 special character"
          : "";
      case "confirmpassword":
        // Check if confirmPassword matches the original password
        return value !== additionalParams.password
          ? "Passwords do not match"
          : "";
      default:
        return "";
    }
  };
  // Forgot Password Data State
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  useEffect(() => {
    setIsSignUp(searchParams.get("signup") === "true");
    setIsForgotPassword(searchParams.get("forgot") === "true");
  }, [searchParams]);

  const updateSearchParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setLoginErrors((prevErrors) => ({
      ...prevErrors,

      general: "",
    }));
    if (loginSubmitted) {
      // Clear error as user types
      setLoginErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(name, value),
      }));
    }
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setSignupErrors((prevErrors) => ({
      ...prevErrors,

      general: "",
    }));
    // Clear error as user types
    if (signupSubmitted) {
      setSignupErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validateField(
          name,
          value,
          name === "confirmpassword" ? { password: signupData.password } : {},
        ),
      }));
    }
  };

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginSubmitted(true);
    // Validate all fields before submission
    const newErrors = {
      email: validateField("email", loginData.email),
      password: validateField("password", loginData.password),
    };

    setLoginErrors(newErrors);

    // If any error exists, stop form submission
    if (Object.values(newErrors).some((error) => error)) return;
    try {
      console.log("Login Data:", loginData);
      // Dispatch login action and wait for response
      const response = await loginUser(loginData);

      console.log("Login Response:", response);

      if (response.success) {
        console.log(`Login successful! User: ${response.user.email}`);

        // Navigate to home page or dashboard
        navigate("/");
      } else {
        console.log("Login Failed:", response.message);

        // Set error message to state for UI display
        setLoginErrors((prevErrors) => ({
          ...prevErrors,
          general: response.message,
        }));
      }
    } catch (error) {
      console.error("Unexpected Login Error:", error);

      setLoginErrors((prevErrors) => ({
        ...prevErrors,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      // Reset form fields after submission
      setLoginData({ email: "", password: "" });
    }
  };
  // Handle Signup Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupSubmitted(true);
    // Validate all fields before submission
    const newErrors = {
      email: validateField("email", signupData.email),
      password: validateField("password", signupData.password),
      confirmpassword: validateField(
        "confirmpassword",
        signupData.confirmpassword,
        { password: signupData.password },
      ),
    };

    setSignupErrors(newErrors);

    // If any error exists, stop form submission
    if (Object.values(newErrors).some((error) => error)) return;
    try {
      console.log("signup Data:", signupData);
      // Dispatch login action and wait for response
      const response = await signupUser(signupData);

      console.log("Login Response:", response);

      if (response.success) {
        console.log(`Regisetering successful! User: ${response.user.email}`);
        updateSearchParams("signup", "");
        // Navigate to home page or dashboard
      } else {
        console.log("regestering  Failed:", response.message);

        // Set error message to state for UI display
        setSignupErrors((prevErrors) => ({
          ...prevErrors,
          general: response.message,
        }));
      }
    } catch (error) {
      console.error("Unexpected Login Error:", error);

      setSignupErrors((prevErrors) => ({
        ...prevErrors,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      // Reset form fields after submission
      setSignupData({ email: "", password: "", confirmpassword: "" });
    }
  };
  // Handle Forgot Password Submission
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot Password Email:", forgotPasswordEmail);
    // Add forgot password logic here
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9]">
      <div className="relative flex h-screen w-full max-w-4xl flex-col items-center justify-center overflow-hidden rounded-md bg-white shadow-lg md:h-[600px] md:flex-row">
        <svg
          width="24px"
          height="24px"
          stroke-width="1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
          className="absolute left-6 top-6 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => navigate("/")}
        >
          <path
            d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
        <div className="flex w-full items-center justify-center p-12 md:w-1/2 md:p-20">
          <div className="relative w-full max-w-md">
            <div className="relative overflow-hidden">
              {!isSignUp && !isForgotPassword ? (
                <div className="translate-x-0 transform opacity-100 transition-all duration-500 ease-in-out group-hover:opacity-90">
                  <h2 className="mb-6 font-poppins text-xl font-medium tracking-wide text-gray-800 md:text-2xl">
                    <span className="text-[#4d4d4d]">Welcome</span>{" "}
                    <span className="text-gray-400">Back</span>
                  </h2>
                  <div className="m-1 flex flex-col space-y-4 font-poppins md:space-y-3">
                    <div className="space-y-5">
                      <div className="relative">
                        <div className="flex h-fit items-center justify-between">
                          <label
                            htmlFor="email"
                            className="ml-0.5 block text-[10px] font-normal leading-none tracking-wide text-gray-600"
                          >
                            Email
                          </label>
                          {LoginErrors.general && (
                            <p
                              className={`absolute -top-0.5 right-0 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                                LoginErrors.general
                                  ? "-translate-y-0 opacity-100"
                                  : "-translate-y-1 opacity-0"
                              }`}
                            >
                              {LoginErrors.general}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none ${
                              LoginErrors.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-gray-300"
                            }`}
                            placeholder="you@example.com"
                          />
                          {/* Floating error badge */}
                          {/* Floating error badge */}
                          <p
                            className={`absolute ml-0.5 mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                              LoginErrors.email
                                ? "-translate-y-0 opacity-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {LoginErrors.email || " "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="ml-0.5 block text-[10px] font-normal leading-none tracking-wide text-gray-600"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div
                            className={`mb-1 mt-1 flex h-fit items-center justify-between rounded-lg border px-3 py-2 focus:border-2 focus:bg-gray-50 ${
                              LoginErrors.password
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-gray-300"
                            }`}
                          >
                            <input
                              type={type}
                              id="password"
                              name="password"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              className="text-[12px] font-light tracking-normal focus:outline-none"
                              placeholder="Enter your password"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              onClick={() => {
                                if (type === "password") {
                                  setType("text");
                                } else {
                                  setType("password");
                                }
                              }}
                              className="h-3.5 w-3.5 text-gray-400 transition-all duration-500 ease-in-out hover:text-gray-500"
                            >
                              {type === "password" ? (
                                <>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                  />
                                </>
                              ) : (
                                <>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                  />
                                </>
                              )}
                            </svg>
                          </div>
                          {/* Floating error badge */}
                          {/* Floating error badge */}
                          <p
                            className={`absolute ml-0.5 w-full bg-white text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                              LoginErrors.password
                                ? "-translate-y-0 opacity-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {LoginErrors.password || " "}
                          </p>
                        </div>
                        <div className="flex items-center justify-between px-1 font-poppins text-[12px] tracking-normal">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              type="checkbox"
                              className="h-[10px] w-[10px] rounded font-normal text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor="remember-me"
                              className="ml-0.5 block text-[10px] text-gray-500"
                            >
                              Remember me
                            </label>
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                updateSearchParams("forgot", "true")
                              }
                              className="text-[10px] font-normal text-gray-500 hover:text-indigo-700"
                            >
                              Forgot your password?
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        text="Log in"
                        variant="filledBlackNoHover"
                        loadingwithText={state.isLoading}
                        loadingText="Logging in..."
                        fullWidth={true}
                        onClick={handleLoginSubmit}
                        size="fixed"
                      />
                    </div>

                    <div className="flex h-fit items-center justify-center py-1">
                      <div className="mr-2 w-[20px] border-t border-gray-300 md:w-full"></div>
                      <span className="text-sm text-gray-500">or</span>
                      <div className="ml-2 w-[20px] border-t border-gray-300 md:w-full"></div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2 font-poppins text-[12px] font-normal text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 48 48"
                          className="mr-2"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                          />
                        </svg>
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 text-center font-poppins tracking-wide md:mt-6">
                    <p className="text-[10px] font-normal text-gray-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => updateSearchParams("signup", "true")}
                        className="font-medium text-indigo-600 underline hover:text-indigo-400"
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </div>
              ) : isSignUp ? (
                <div
                  key="signup"
                  className="translate-x-0 transform opacity-100 transition-all duration-500 ease-in-out group-hover:opacity-90"
                >
                  <h2 className="mb-6 font-poppins text-xl font-medium tracking-normal text-gray-800 md:text-2xl">
                    <span className="text-[#4d4d4d]">Create</span>{" "}
                    <span className="text-gray-400">Account</span>
                  </h2>
                  <div className="m-1 flex flex-col space-y-4 font-poppins md:space-y-3">
                    <div className="space-y-5">
                      <div className="relative">
                        <div className="flex h-fit items-center justify-between">
                          <label
                            htmlFor="email"
                            className="ml-0.5 block text-[10px] font-normal leading-none tracking-wide text-gray-600"
                          >
                            Email
                          </label>
                          {SignupErrors.general && (
                            <p
                              className={`absolute -top-0.5 right-0 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                                SignupErrors.general
                                  ? "-translate-y-0 opacity-100"
                                  : "-translate-y-1 opacity-0"
                              }`}
                            >
                              {SignupErrors.general}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={signupData.email}
                            onChange={handleSignupChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none ${
                              SignupErrors.email
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-gray-300"
                            }`}
                            placeholder="you@example.com"
                          />
                          {/* Floating error badge */}
                          <p
                            className={`absolute ml-0.5 mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                              SignupErrors.email
                                ? "-translate-y-0 opacity-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {SignupErrors.email || " "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="ml-0.5 block text-[10px] font-normal leading-none tracking-wide text-gray-600"
                        >
                          Create Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none ${
                              SignupErrors.password
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-gray-300"
                            }`}
                            placeholder="Create your password"
                          />
                          {/* Floating error badge */}
                          <p
                            className={`absolute ml-0.5 mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                              SignupErrors.password
                                ? "-translate-y-0 opacity-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {SignupErrors.password || " "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="ml-0.5 block text-[10px] font-normal leading-none tracking-wide text-gray-600"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="confirmpassword"
                            name="confirmpassword"
                            value={signupData.confirmpassword}
                            onChange={handleSignupChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none ${
                              SignupErrors.confirmpassword
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-gray-300"
                            }`}
                            placeholder="Confirm your password"
                          />
                          <p
                            className={`absolute ml-0.5 mt-0.5 text-[10px] font-light tracking-wide text-red-500 transition-all duration-500 ease-in-out ${
                              SignupErrors.confirmpassword
                                ? "-translate-y-0 opacity-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {SignupErrors.confirmpassword || " "}
                          </p>
                        </div>
                      </div>

                      <div className="">
                        <Button
                          text="Register"
                          variant="filledBlackNoHover"
                          loadingwithText={state.isLoading}
                          loadingText="Signing up..."
                          fullWidth={true}
                          onClick={handleSignupSubmit}
                          size="fixed"
                        />
                      </div>
                    </div>
                    <div className="flex h-fit items-center justify-center py-1">
                      <div className="mr-2 w-[20px] border-t border-gray-300 md:w-full"></div>
                      <span className="text-sm text-gray-500">or</span>
                      <div className="ml-2 w-[20px] border-t border-gray-300 md:w-full"></div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-2 font-poppins text-[12px] font-normal text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 48 48"
                          className="mr-2"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          />
                          <path
                            fill="#FF3D00"
                            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                          />
                          <path
                            fill="#4CAF50"
                            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                          />
                          <path
                            fill="#1976D2"
                            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                          />
                        </svg>
                        Sign up with Google
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 text-center font-poppins tracking-wide md:mt-6">
                    <p className="text-[10px] font-normal text-gray-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => updateSearchParams("signup", "")}
                        className="font-medium text-indigo-600 underline hover:text-indigo-400"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </div>
              ) : isForgotPassword ? (
                <div>
                  <h2 className="mb-2 font-poppins text-xl font-medium tracking-wide text-gray-800 md:text-2xl">
                    <span className="text-[#4d4d4d]">Reset</span>{" "}
                    <span className="text-gray-400">Password</span>
                  </h2>
                  <p className="mb-2 text-left font-poppins text-[10px] font-light tracking-wide text-gray-500">
                    Enter the email address associated with your account. We'll
                    send you a link to reset your password.
                  </p>

                  <div className="flex flex-col gap-3 font-poppins">
                    <div>
                      <label className="block text-[10px] font-normal tracking-wide text-gray-600">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-[12px] font-light tracking-wide text-[#4d4d4d] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-full bg-[#4d4d4d] px-3 py-2 font-poppins text-[12px] font-normal tracking-wide text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Reset Password
                      </button>
                    </div>
                    <div className="mt-4 text-center font-poppins tracking-wide">
                      <p className="text-[10px] font-normal text-gray-600">
                        <button
                          type="button"
                          onClick={() => updateSearchParams("forgot", "")}
                          className="font-medium text-indigo-600 underline hover:text-indigo-400"
                        >
                          Back to Sign In
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="relative hidden h-full w-1/2 md:block">
          <img
            src="../public/Images/HEADER.png"
            alt="Login header background"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <span className="absolute right-6 top-4 w-fit text-center font-poppins text-[12px] font-medium leading-[22px] tracking-wide text-white">
            CRAFTED CORNER
          </span>
          <span className="absolute bottom-8 left-1/2 w-[270px] -translate-x-1/2 transform text-center font-poppins text-[10px] font-light leading-[22px] tracking-[0.4px] text-white">
            Unlock your world of style and comfort, log in to transform your
            space
          </span>
        </div>
      </div>
    </div>
  );
}
