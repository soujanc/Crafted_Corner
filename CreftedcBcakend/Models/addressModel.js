const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  // user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   },
  isDefault: {
    type: Boolean,
    default: false,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User (null for guests)
    ref: "User",
    default: null, // If null, it means a guest user
  },
  guestId: {
    type: String,

    default: null, // If null, it means a guest user
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Home", "Work", "Other"],
  },
  street: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
  },
  zipCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("address", addressSchema);
// {
//     id: 1, // Unique identifier for this address
//     type: "Home", // Type of the address (e.g., Home, Work, etc.)
//     name: "John Doe", // Name of the person associated with the address
//     street: "123 Main St", // Street address
//     landmark: "opposite chigga kumars building", // Apartment number or details (if applicable)
//     city: "New York", // City name
//     state: "NY", // State code
//     zipCode: "10001", // Zip code for the address
//     country: "United States", // Country name
//     isDefault: true, // This address is marked as the default address
//     phone: "+1 (555) 123-4567", // Phone number associated with the address
//   },
// ];
