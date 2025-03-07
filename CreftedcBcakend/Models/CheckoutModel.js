const mongoose = require("mongoose");

// Define the checkout schema
const CheckoutSchema = new mongoose.Schema(
  {
    // Product Details
    checkoutProduct: {
      productId: { type: String, required: true },
      color: { type: String, required: true },
      quantity: { type: Number, required: true },
      productDetails: { type: Object, required: true }, // Store additional product info
    },

    // Pricing Information
    pricing: {
      subtotal: { type: Number, required: true },
      shippingPrice: { type: Number, required: true },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    // Personal Information
    personalInformation: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },

    // Address Information
    address: {
      id: { type: String, required: true },
      street: { type: String, required: true },
      apartment: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Shipping Method
    shippingMethod: {
      type: String,
      enum: ["standard", "express"],
      required: true,
      default: "standard",
    },

    // Payment Method
    paymentMethod: {
      type: String,
      enum: ["card", "cod", "gpay", "phonepe"],
      required: true,
    },

    // Timestamps for created and updated
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Checkout model
module.exports = mongoose.model("checkout", CheckoutSchema);
