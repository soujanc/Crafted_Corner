const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: "USA" },
});

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  roomtype: { type: String, required: true },
  color: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  dimensions: {
    height: { type: Number },
    width: { type: Number },
    depth: { type: Number },
  },
  weight: { type: String },
  material: { type: String },
  image: { type: String },
});

const StatusDatesSchema = new mongoose.Schema({
  confirmed: { type: Date },
  shipped: { type: Date },
  out_for_delivery: { type: Date }, // Special case, only stores time
  delivered: { type: Date },
});
//how to format date on frontend
// const formatDate = (date) => {
//     return date ? `on ${new Date(date).toLocaleString("en-US", {
//       hour: "numeric", minute: "numeric", hour12: true,
//       month: "short", day: "numeric", year: "numeric"
//     })}` : null;
//   };

//   const order = {
//     confirmed: formatDate("2024-02-08T09:00:00Z"),
//     shipped: formatDate("2024-02-10T10:35:00Z"),
//     out_for_delivery: "6 PM",
//     delivered: formatDate("2024-02-26T06:00:00Z"),
//   };

//   console.log(order);
//example output
// {
//     "confirmed": "on 9:00 AM, Feb 8, 2024",
//     "shipped": "on 10:35 AM, Feb 10, 2024",
//     "out_for_delivery": "6 PM",
//     "delivered": "on 6:00 AM, Feb 26, 2024"
//   }

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User (null for guests)
      ref: "User",
      default: null, // If null, it means a guest user
    },
    guestId: {
      type: String,
      default: null, // If null, it means a guest user
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    shippingMethod: { type: String, required: true },
    shippingAddress: { type: AddressSchema, required: true },
    orderStatus: {
      type: String,
      enum: [
        "failed",
        "pending",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
      ], //currently no cancelling order might implement it later
      default: "pending",
    },
    statusDates: {
      type: StatusDatesSchema,
    },
    items: { type: [ItemSchema], required: true },
    taxAmount: { type: Number, default: 0, required: true },
    shippingFee: { type: Number, default: 0, required: true },
    trackingNumber: { type: String },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Order", OrderSchema);

//sample object
// {
//     "orderId": "ORD123456",
//     "userId": "65c9f7a5b62e1a0012d4c9f3",
//     "date": "2024-02-07T14:30:00Z",
//     "shippingMethod": "Express",
//     "orderStatus": "shipped",
//     "statusDates": {
//       "confirmed": "2024-02-08T09:00:00Z",
//       "shipped": "2024-02-10T10:35:00Z",
//       "out_for_delivery": "6 PM",
//       "delivered": "2024-02-26T06:00:00Z"
//     },
//     "items": [
//       {
//         "productId": "PROD001",
//         "name": "Modern Sofa",
//         "roomtype": "Living Room",
//         "color": "Gray",
//         "category": "Furniture",
//         "price": 499.99,
//         "quantity": 1,
//         "dimensions": {
//           "height": 34,
//           "width": 84,
//           "depth": 38
//         },
//         "weight": "90 lbs",
//         "material": "Leather",
//         "image": "https://example.com/images/sofa.jpg",
//         "deliveryAddress": {
//           "street": "123 Main St",
//           "city": "Los Angeles",
//           "state": "CA",
//           "zipCode": "90001",
//           "country": "USA"
//         }
//       },
//       {
//         "productId": "PROD002",
//         "name": "Wooden Dining Table",
//         "roomtype": "Dining Room",
//         "color": "Brown",
//         "category": "Furniture",
//         "price": 299.99,
//         "quantity": 1,
//         "dimensions": {
//           "height": 30,
//           "width": 60,
//           "depth": 36
//         },
//         "weight": "70 lbs",
//         "material": "Oak Wood",
//         "image": "https://example.com/images/dining_table.jpg",
//         "deliveryAddress": {
//           "street": "123 Main St",
//           "city": "Los Angeles",
//           "state": "CA",
//           "zipCode": "90001",
//           "country": "USA"
//         }
//       }
//     ],
//     "taxAmount": 25.00,
//     "shippingfee": 15.00,
//     "trackingNumber": "TRK123456789",
//     "totalAmount": 839.98,
//     "paymentStatus": "paid"
//   }
