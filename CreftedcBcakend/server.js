const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser"); //very very importeant to pasre the cookie we store and retrieve
const stripe = require("stripe")(
  "sk_test_51QlthVHjzz3ZRfG0u42tFKCGr8bBOcqKB7eBcOsxtP5VRzFDC8DkcwZfdwCDg0OOCjN50HHiPjoNSNiI6iyxoGi500JbC8taP1"
);

const cors = require("cors"); //to allow cross-origin requests like if frontend localhost is 3000 and backend localhost 5000
const app = express();
const port = process.env.PORT || 5000;
const errorHandler = require("./Middlewares/errorHandler"); //to handle errors middleware
const connectDB = require("./config/dbconnection"); //to connect to the database

//IMPORTANT// structure of queriys /api/products?key1=value1&key2=value2&key3=value3//

// CORS middleware
// CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow the frontend running on port 5173
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"], // Allow specific headers
    credentials: true, // Allow credentials (cookies or authorization headers)
  })
);

// Establish connection to the MongoDB database
// This initializes the database connection before the server starts listening
connectDB();
app.use(cookieParser());
app.use(express.json()); //to get json data from client its a parser middleware
app.use("/api/products", require("./Routes/productRouter")); // to get product details
app.use("/api/address", require("./Routes/addressRouter")); //to get address details
app.use("/api/payment", require("./Routes/paymentRouter")); //stripe  payments routes with modular approch
app.use("/api/orders", require("./Routes/OrderRoute"));
app.use("/api/cart", require("./Routes/cartRoutes"));
app.use("/api/users", require("./Routes/UserRoute")); // to create update delete.... orders
app.use(errorHandler); //to handle errors, its a middleware

app.listen(port, () => {
  console.log("app listening to port", port);
});
