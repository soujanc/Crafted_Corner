const express = require("express");
/** Express router for handling order-related routes */
const router = express.Router();
const { createorder } = require("../controllers/OrderControllers");
const {
  updateOrderStatusByDate,
  updateOrderPaymentStatus,
  fetchOrder,
} = require("../controllers/OrderControllers");
/**
 * POST route for creating a new order
 *
 * @name POST/
 * @route POST /api/orders
 * @function
 *
 * @description
 * Handles the creation of a new order in the system:
 * - Accepts order details through request body
 * - Validates and processes order information
 * - Generates unique order identifiers
 * - Saves order to the database
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Order creation payload
 * @param {string} req.body.name - Customer name
 * @param {string} req.body.email - Customer email
 * @param {Array} req.body.items - List of ordered items
 * @param {number} req.body.totalAmount - Total order amount
 *
 * @param {Function} createorder - Controller function to handle order creation
 *
 * @returns {Object} Created order details
 *
 * @throws {Error} Throws an error if order creation fails
 *
 * @example
 * // Typical request body
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "items": [{
 *     "productId": "prod_123",
 *     "name": "Wooden Chair",
 *     "quantity": 2,
 *     "price": 199.99
 *   }],
 *   "totalAmount": 399.98
 * }
 */
router.post("/", createorder);

/**
 * @route GET /api/orders/get-orders
 * @desc Retrieve all orders with optional filtering
 * @access Private (Typically restricted to authenticated users)
 *
 * @queryParam {string} [userId] - Optional. Filter orders by specific user ID
 * @queryParam {string} [status] - Optional. Filter orders by order status (e.g., 'pending', 'completed')
 *
 * @returns {Object} Response object containing:
 * - {boolean} success - Indicates if the fetch was successful
 * - {string} message - Descriptive message about the fetch operation
 * - {Array} orders - List of order documents
 *
 * @response 200 - Successfully retrieved orders
 * @response 404 - No orders found
 * @response 500 - Server error during order retrieval
 *
 * @example
 * // Fetch all orders
 * GET /api/orders/get-orders
 *
 * @example
 * // Fetch orders for a specific user
 * GET /api/orders/get-orders?userId=123
 *
 * @example
 * // Fetch orders with a specific status
 * GET /api/orders/get-orders?status=pending
 */
router.get("/get-orders", fetchOrder);

/**
 * PATCH route for updating order payment status
 *
 * @name PATCH/update-status
 * @route PATCH /api/orders/update-status
 * @function
 *
 * @description
 * Handles updating the payment status of an existing order:
 * - Accepts order ID and new payment status
 * - Validates input parameters
 * - Updates order's payment and order status in the database
 * - Provides comprehensive error handling
 *
 * Supported payment statuses:
 * - 'paid': Successful payment
 * - 'failed': Payment unsuccessful
 * - 'pending': Payment in progress
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Payment status update payload
 * @param {string} req.body.orderId - Unique identifier of the order to update
 * @param {string} req.body.status - New payment status ('paid', 'failed', 'pending')
 *
 * @param {Function} updateOrderPaymentStatus - Controller function to handle payment status update
 *
 * @returns {Object} Updated order details
 *
 * @throws {Error} Throws an error if payment status update fails
 *
 * @example
 * // Typical request body
 * {
 *   "orderId": "order_123",
 *   "status": "paid"
 * }
 */
router.patch("/update-status", updateOrderPaymentStatus);

/**
 
 */
router.patch("/update-datestatus", updateOrderStatusByDate);

module.exports = router;
