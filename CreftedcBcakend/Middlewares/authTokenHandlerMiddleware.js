const { verifyToken } = require("../Utils/jwtUtils");
const asyncHandler = require("express-async-handler");

const authenticate = asyncHandler(async (req, res, next) => {
  //   let token;
  //   let authHeaders = req.headers.authorization || req.headers.Authorization;
  //   if (authHeaders && authHeaders.startsWith("Bearer")) {
  //     token = req.headers["authorization"]?.split(" ")[1];
  //   }
  // Extensive logging
  console.log("Incoming Request Headers:", req.headers);
  console.log("Incoming Cookies:", req.cookies);
  console.log("Authorization Header:", req.headers.authorization);
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ userId: null }); // ✅ Return 200 with null user
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Crucially, this line attaches userId to the request object tihsi will be extracted by the cureentuser controller because this authenticate is inside router of current user
  req.userId = decoded.userId; // Attach the user ID to the request object
  next();
});

module.exports = authenticate;
