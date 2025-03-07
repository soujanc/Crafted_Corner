const mongoose = require("mongoose");

// Custom validator to limit array length
function arrayLimit(val) {
  return val.length <= 5;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Side Chair", "Dining Chair", "Office Chair", "Lounge Chair"],
    },
    roomType: {
      type: String,
      enum: ["Living Room", "Dining Room", "Bed Room", "Office"],
    },
    tags: {
      type: String,
      enum: ["Popular", "Trending", "New Arrivals", "Top Picks"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },

    images: {
      type: [String],
      validate: [arrayLimit, "Maximum 5 images allowed"],
      default: [],
    },
    dimensions: {
      height: {
        type: String,
        default: "",
      },
      width: {
        type: String,
        default: "",
      },
      depth: {
        type: String,
        default: "",
      },
    },
    weight: {
      type: String,
      default: "",
    },
    material: {
      type: String,
      required: [true, "Product material is required"],
    },
    materialsUsed: {
      type: String,
      default: "",
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    colorStock: {
      type: [String],
      default: ["beige", "gray", "black"],
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference other products in the same collection
        ref: "Product", // Collection name
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
