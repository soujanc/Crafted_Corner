const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../Utils/jwtUtils");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }
    // Generate JWT token
    const token = generateToken(user._id);
    // Send token as HTTP-Only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: false, // Set to true in production (HTTPS required)
      sameSite: "lax",

      maxAge: 24 * 60 * 60 * 1000,
      // Adjust if CSRF issues occur
    });
    // Log cookie details for debugging
    console.log("Login Cookie Set:", {
      token: token,
      domain: "localhost",
      httpOnly: true,
      secure: false,
    });
    // Optional: Return minimal user info
    const userResponse = {
      id: user._id,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const signup = asyncHandler(async (req, res) => {
  const { email, password, confirmpassword } = req.body;
  // Input validations
  if (!email || !password || !confirmpassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    // Optional: Return user response
    const userResponse = {
      id: newUser._id,
      email: newUser.email,
    };
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token, // Send JWT token to the user
      user: userResponse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating user", error });
  }
});

const currentUser = asyncHandler(async (req, res) => {
  try {
    // Directly access userId that was attached by the middleware
    const userId = req.userId;
    if (!userId) {
      return res.status(200).json({ user: null });
    } // Extracted from the token
    const user = await User.findById(userId).select("-password"); //populate("carts") and populate("orders") and populate("address") heres// Exclude password
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ sucess: true, message: "User found", user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data", error });
  }
});
const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      // Match your frontend domain
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed", error });
  }
});

module.exports = {
  login,
  signup,
  currentUser,
  logout,
};
