const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"],
    },
    carts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cart", // Refers to Cart collection
        },
      ],
      // Reference to multiple orders for the user
      orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order", // Refers to Order collection
        },
      ],
      // Reference to multiple addresses for the user
      addresses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Address", // Refers to Address collection
        },
      ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);