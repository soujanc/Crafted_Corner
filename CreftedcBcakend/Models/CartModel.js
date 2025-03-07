const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User (null for guests)
      ref: "User",
      default: null, // If null, it means a guest user
    },
    guestId: {
      type: String,
      default: null, // If null, it means a guest user
    },
    products: [
      {
        _id: false,
        productId: {
          type: String, // ✅ Store the custom productId as a string
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Ensures at least 1 item
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
