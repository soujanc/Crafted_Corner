const express = require("express");
/** Express router for handling order-related routes */
const router = express.Router();
const authenticate = require("../Middlewares/authTokenHandlerMiddleware");
const {
  login,
  signup,
  currentUser,
  logout,
} = require("../controllers/UserController");

router.post("/login", login);
router.post("/signup", signup);
router.get("/current-user", authenticate, currentUser);
router.get("/logout", authenticate, logout);

module.exports = router;
