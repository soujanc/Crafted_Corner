const mongoose = require("mongoose");
const Order = require("../Models/OrderModel");
const asyncHandler = require("express-async-handler");

// Generate a unique order ID
const generateOrderId = () => {
  return "ORD" + Math.random().toString(36).slice(2, 11).toUpperCase();
};

/**
 * Creates a new order in the system.
 *
 * @desc Handles the complete workflow of order creation, including:
 * - Validating incoming order data
 * - Performing comprehensive item validation
 * - Generating unique order and tracking identifiers
 * - Creating and saving a new order document
 * - Providing detailed error handling and response mechanisms
 *
 * Key order creation features:
 * - Supports multiple item details validation
 * - Generates unique order and tracking numbers
 * - Sets default values for optional fields
 * - Handles various shipping and payment scenarios
 *
 * @function createorder
 * @async
 * @route POST /api/orders/create
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing order details
 * @param {string} [req.body.userId] - Optional user identifier
 * @param {string} req.body.name - Customer name
 * @param {string} req.body.email - Customer email
 * @param {string} req.body.phone - Customer phone number
 * @param {Array} req.body.items - List of ordered items
 * @param {number} req.body.totalAmount - Total order amount
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with:
 * - 201 status with created order on successful creation
 * - 400 status for invalid input
 * - 500 status for server errors
 *
 * @throws {Error} Throws an error if order creation fails or data validation fails
 *
 * @description
 * - Validates and transforms order items
 * - Generates unique order and tracking identifiers
 * - Sets default order status and payment status
 * - Handles optional shipping and order metadata
 *
 * @example
 * // Typical request body
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "1234567890",
 *   "items": [{
 *     "productId": "prod_123",
 *     "name": "Wooden Chair",
 *     "quantity": 2,
 *     "price": 199.99
 *   }],
 *   "totalAmount": 399.98
 * }
 */
const createorder = asyncHandler(async (req, res) => {
  try {
    console.log("Full Request Body:", JSON.stringify(req.body, null, 2));
    const {
      userId,
      guestId,
      name,
      email,
      phone,
      shippingMethod,
      items,
      taxAmount,
      shippingFee,
      totalAmount,
      trackingNumber,
      shippingAddress,
      paymentStatus,
      statusDates,
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Invalid order data. User ID and items are required.",
      });
    }

    // Validate items have all required fields
    const validatedItems = items.map((item) => {
      if (
        !item.productId ||
        !item.name ||
        !item.roomtype ||
        !item.color ||
        !item.category ||
        !item.weight ||
        !item.material ||
        !item.dimensions ||
        !item.price ||
        !item.quantity ||
        !item.image
      ) {
        throw new Error("Incomplete item details");
      }
      return {
        productId: item.productId,
        name: item.name,
        roomtype: item.roomtype,
        color: item.color,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
        dimensions: item.dimensions || {},
        weight: item.weight,
        material: item.material,
        image: item.image,
      };
    });

    // Determine userId and guestId
    let finalGuestId = guestId || req.headers["guest-id"]; // Prioritize frontend's guestId

    // If no userId and no guestId, generate a backup guestId
    if (!userId && !finalGuestId) {
      finalGuestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
    }

    // Create new order
    const newOrder = new Order({
      orderId: generateOrderId(),
      userId: userId || null,
      guestId: userId ? null : finalGuestId,
      name,
      email,
      phone,
      date: new Date(),
      shippingMethod: shippingMethod || "Standard",
      shippingAddress: shippingAddress || {},
      orderStatus: "pending",
      items: validatedItems,
      taxAmount: taxAmount || 0,
      shippingFee: shippingFee || 0,
      trackingNumber: trackingNumber || generateTrackingNumber(),
      totalAmount,
      paymentStatus: paymentStatus || "pending",
      statusDates: statusDates || {
        confirmed: null,
        shipped: null,
        out_for_delivery: null,
        delivered: null,
      },
    });

    // Save order
    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
});
/**
 * Updates the payment status of an existing order.
 *
 * @desc Handles the complete workflow of updating an order's payment status in the system.
 * This controller is responsible for:
 * - Receiving payment status updates from payment gateways
 * - Validating the incoming payment status
 * - Updating the order's payment and order status in the database
 * - Providing comprehensive error handling and response mechanisms
 *
 * The function supports three payment statuses:
 * - 'paid': Successful payment (sets order status to 'pending')
 * - 'failed': Payment unsuccessful (sets order status to 'failed')
 * - 'pending': Ongoing payment process (sets order status to 'pending')
 *
 * @function updateOrderPaymentStatus
 * @async
 * @route PATCH /api/orders/update-status
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing order details
 * @param {string} req.body.orderId - Unique identifier of the order to update
 * @param {string} req.body.status - New payment status ('paid', 'failed', 'pending')
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with:
 * - 200 status with updated order on successful update
 * - 400 status for invalid input
 * - 404 status if order not found
 * - 500 status for server errors
 *
 * @throws {Error} Throws an error if database update fails
 *
 * @description
 * - Validates order ID and payment status
 * - Dynamically sets order status based on payment status
 * - Uses MongoDB findOneAndUpdate with validation
 * - Provides detailed error handling and response
 *
 * @example
 * // Typical request body
 * {
 *   "orderId": "order_123",
 *   "status": "paid"
 * }
 */
const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate required fields
    // Validate input
    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
        success: false,
      });
    }

    if (!status || !["paid", "failed", "pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid payment status",
        success: false,
      });
    }

    // Determine orderStatus based on paymentStatus
    let orderStatus = "pending"; // Default for COD
    if (status === "failed") {
      orderStatus = "failed";
    } else if (status === "paid") {
      orderStatus = "pending"; // Manually update orderStatus later after payment
    }

    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        paymentStatus: status,
        orderStatus: orderStatus, // Dynamically set
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure model validation rules are applied
      }
    );

    // If no order is found, return a 404 error
    if (!updatedOrder) {
      return res.status(404).json({
        message: `Order with ID ${orderId} not found`,
        success: false,
      });
    }

    // Return the updated order
    res.status(200).json({
      message: "Order payment status updated successfully",
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order Update Error:", error);
    res.status(500).json({
      message: "Error updating order payment status",
      success: false,
      error: error.message,
    });
  }
});

/**
 * Retrieves all orders from the database
 *
 * @function fetchOrder
 * @async
 * @description
 * - Fetches all orders sorted by date in descending order
 * - Excludes Mongoose version key from results
 * - Handles scenarios with no orders found
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Optional query parameters (not used in current implementation)
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with:
 * - {boolean} success - Indicates if orders were successfully retrieved
 * - {string} message - Descriptive message about the fetch operation
 * - {Array} orders - List of order documents, sorted by most recent date
 *
 * @throws {Error} Throws and handles errors during order retrieval
 *
 * @response 200 - Successfully retrieved orders
 * @response 404 - No orders found in the database
 * @response 500 - Server error during order retrieval
 *
 * @example
 * // Successful response
 * {
 *   success: true,
 *   message: "Orders fetched successfully",
 *   orders: [
 *     {
 *       _id: "...",
 *       name: "Order Name",
 *       date: "2024-02-14T...",
 *       // other order details
 *     }
 *   ]
 * }
 *
 * @example
 * // No orders found response
 * {
 *   success: false,
 *   message: "No orders found"
 * }
 *
 * @example
 * // Error response
 * {
 *   success: false,
 *   message: "Error fetching all orders",
 *   error: "Detailed error message"
 * }
 */
const fetchOrder = asyncHandler(async (req, res) => {
  try {
    const { userId, guestId } = req.query; // Extract userId and guestId from query parameters

    // Create a query object based on the presence of userId or guestId
    const query = {};
    if (userId) {
      query.userId = userId; // Fetch orders for the logged-in user
    } else if (guestId) {
      query.guestId = guestId; // Fetch orders for the guest
    } else {
      return res.status(400).json({
        message: "Either userId or guestId must be provided",
        success: false,
      });
    }
    const orders = await Order.find(query).sort({ date: -1 }).select("-__v");
    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
        success: false,
      });
    } // Return orders
    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error("Order Update Error:", error);
    res.status(500).json({
      message: "Error fetching all orders",
      success: false,
      error: error.message,
    });
  }
});

/**
 * Updates specific status dates for an order by its order ID.
 *
 * @function updateOrderStatusByDate
 * @async
 * @desc Handles updating individual status dates for an order
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing order details
 * @param {string} req.body.orderId - Unique identifier of the order to update
 * @param {Object} req.body.statusDates - Object containing status dates to update
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response with:
 * - 200 status with updated order on successful update
 * - 400 status for invalid input
 * - 404 status if order not found
 * - 500 status for server errors
 *
 * @example
 * // Request body example
 * {
 *   "orderId": "ORD123456",
 *   "statusDates": {
 *     "confirmed": new Date(),
 *     "shipped": new Date()
 *   }
 * }
 */
const updateOrderStatusByDate = asyncHandler(async (req, res) => {
  try {
    const { orderId, statusDates } = req.body;

    // Validate required fields
    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required",
        success: false,
      });
    }

    // Validate status dates
    if (!statusDates || typeof statusDates !== "object") {
      return res.status(400).json({
        message: "Invalid status dates format",
        success: false,
      });
    }

    // Allowed status date fields
    const allowedFields = [
      "confirmed",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    // Convert statusDates to Date objects
    const validStatusDates = Object.keys(statusDates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = new Date(statusDates[key]); // Convert string to Date object
        return obj;
      }, {});

    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        $set: { statusDates: validStatusDates },
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure model validation rules are applied
      }
    );

    // If no order is found, return a 404 error
    if (!updatedOrder) {
      return res.status(404).json({
        message: `Order with ID ${orderId} not found`,
        success: false,
      });
    }

    // Return the updated order
    res.status(200).json({
      message: "Order status dates updated successfully",
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order Status Dates Update Error:", error);
    res.status(500).json({
      message: "Error updating order status dates",
      success: false,
      error: error.message,
    });
  }
});

module.exports = {
  createorder,
  updateOrderPaymentStatus,
  fetchOrder,
  updateOrderStatusByDate,
};
