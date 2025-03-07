const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });//remember to change this during production
  
};

const verifyToken = (token) => {
  try {
    // Directly verify and return decoded token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (err) {
    // Different error handling for different types of JWT errors
    if (err.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Authentication failed");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
