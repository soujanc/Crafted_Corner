const express = require("express");
/** Express router for handling order-related routes */
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItemQuantity,
  deleteCartProduct,
} = require("../controllers/CartController");
/**
 * POST route for adding an item to the cart
 *
 * @name POST/add-to-cart
 * @route POST /api/cart/add-to-cart
 * @function
 *
 * @description
 * Handles adding a product to the cart with the following key features:
 * - Supports adding a new item to an existing cart
 * - Creates a new cart if no cart exists
 * - Validates product existence
 * - Manages cart item quantity
 *
 * Cart Management Workflow:
 * 1. If cartId is provided, updates existing cart
 * 2. If no cartId exists, creates a new cart with a unique ID
 * 3. Handles quantity updates for existing cart items
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request payload for adding to cart
 * @param {string} [req.body.cartId] - Optional existing cart identifier
 * @param {string} req.body.productId - Unique identifier of the product to add
 * @param {number} req.body.quantity - Quantity of the product to add
 *
 * @param {Function} addToCart - Controller function to handle cart addition
 *
 * @returns {Object} JSON response with:
 * - 201 status for new cart creation
 * - 200 status for cart update
 * - Cart details and new cartId if created
 *
 * @throws {Error} Handles various error scenarios:
 * - Invalid product ID
 * - Invalid quantity
 * - Product not found
 * - Server errors
 *
 * @example
 * // Adding a product to cart
 * {
 *   "cartId": "optional-existing-cart-id", // Optional
 *   "productId": "prod_123",
 *   "quantity": 2
 * }
 */
router.post("/add-to-cart", addToCart);
/**
 * GET route for retrieving cart details
 *
 * @name GET/get-cart
 * @route GET /api/cart/get-cart
 * @function
 *
 * @description
 * Retrieves comprehensive cart information with the following features:
 * - Fetches cart details using a unique cart identifier
 * - Retrieves detailed product information for each cart item
 * - Supports carts with multiple products
 * - Provides error handling for non-existent carts
 *
 * Cart Retrieval Workflow:
 * 1. Validates the provided cart identifier
 * 2. Fetches cart details from the database
 * 3. Populates product details for each cart item
 * 4. Returns structured cart response
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.cartId - Unique identifier of the cart to retrieve
 *
 * @param {Function} getCart - Controller function to handle cart retrieval
 *
 * @returns {Object} JSON response with:
 * - 200 status for successful cart retrieval
 * - Detailed cart information including:
 *   - Cart ID
 *   - List of products with details
 *   - Product quantities
 *   - Product prices
 *
 * @throws {Error} Handles various error scenarios:
 * - Invalid cart ID
 * - Cart not found
 * - Server errors during cart retrieval
 *
 * @example
 * // Successful cart retrieval response
 * {
 *   "message": "Cart retrieved successfully",
 *   "success": true,
 *   "cart": {
 *     "cartId": "cart_123",
 *     "products": [
 *       {
 *         "productId": "prod_456",
 *         "name": "Wooden Chair",
 *         "price": 199.99,
 *         "quantity": 2,
 *         "images": ["url1", "url2"]
 *       }
 *     ]
 *   }
 * }
 */
router.get("/get-cart", getCart);

router.put("/update-quantity", updateCartItemQuantity);
/**
 * DELETE route for removing a product from the cart
 *
 * @name DELETE/delete-product
 * @route DELETE /api/cart/delete-product
 * @function
 *
 * @description
 * Handles removing a specific product from the cart:
 * - Requires cart ID and product ID
 * - Validates cart and product existence
 * - Removes product from cart
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request payload
 * @param {string} req.body.cartId - Unique identifier of the cart
 * @param {string} req.body.productId - Unique identifier of the product to remove
 *
 * @param {Function} deleteCartProduct - Controller function to handle product deletion
 *
 * @returns {Object} JSON response with:
 * - Success status
 * - Confirmation message
 *
 * @throws {Error} Handles various error scenarios:
 * - Invalid cart ID
 * - Invalid product ID
 * - Product not found in cart
 *
 * @example
 * // Request body
 * {
 *   "cartId": "cart_123",
 *   "productId": "prod_456"
 * }
 */
router.delete("/delete-product", deleteCartProduct);

module.exports = router;
