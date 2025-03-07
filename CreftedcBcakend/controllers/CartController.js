const Cart = require("../Models/CartModel"); // Cart model
const Product = require("../Models/ProductModel"); // Product model
const { v4: uuidv4 } = require("uuid"); // Generates unique cartId
/**
 * Adds a product to the shopping cart for a user or guest.
 *
 * This function handles the addition of a product to the cart. It checks for required fields,
 * validates the product's existence, and manages the cart based on whether the user is logged in
 * or a guest. If the cart does not exist, it creates a new one.
 *
 * @async
 * @function addToCart
 * @param {Object} req - The request object containing the body with product details.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {string} req.body.userId - The ID of the user adding the product to the cart.
 * @param {string} req.body.guestId - The ID of the guest adding the product to the cart.
 * @param {string} req.body.productId - The ID of the product to be added to the cart. This is required.
 * @param {number} req.body.quantity - The quantity of the product to be added. This must be greater than 0.
 * @param {string} req.body.color - The color of the product to be added. This is required.
 * @returns {Promise<void>} - Returns a JSON response with the cart details if the product is successfully added,
 *                            or an error message if not. The response structure includes:
 *                            - message: A string indicating success or failure.
 *                            - cart: An object containing the updated cart details if successful.
 * @throws {Error} - If there is a server error during the addition process, an error message
 *                   will be returned in the response with a 500 status.
 *
 * @example
 * // Request Body
 * {
 *   "userId": "user_123456",
 *   "productId": "prod_789012",
 *   "quantity": 2,
 *   "color": "Blue"
 * }
 *
 * @example
 * // Successful Response
 * {
 *   "message": "Item added to cart",
 *   "cart": {
 *     "userId": "user_123456",
 *     "products": [
 *       {
 *         "productId": "prod_789012",
 *         "quantity": 2,
 *         "color": "Blue"
 *       }
 *     ]
 *   }
 * }
 *
 * @example
 * // Error Response (Product Not Found)
 * {
 *   "message": "Product not found",
 *   "success": false
 * }
 *
 * @note
 * The function supports both user and guest cart management. If neither userId nor guestId
 * is provided, a new guest ID will be generated. The function also allows for updating the
 * quantity of an existing product in the cart if it is already present.
 */
const addToCart = async (req, res) => {
  try {
    const { userId, guestId, productId, quantity, color } = req.body;
    console.log("Request Body from the cartreducer:", req.body);

    // Enhanced validation
    if (!productId) {
      return res
        .status(400)
        .json({ message: "Product ID is required", success: false });
    }

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Valid quantity is required", success: false });
    }

    if (!color) {
      return res
        .status(400)
        .json({ message: "Color is required", success: false });
    }

    // Check if the product exists using `productId`
    const product = await Product.findOne({ productId: String(productId) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine guestId if not provided
    let finalGuestId = guestId;
    if (!userId && !finalGuestId) {
      finalGuestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
    }

    // Determine cart identifier (userId or guestId)
    const cartIdentifier = userId || finalGuestId;

    if (!cartIdentifier) {
      return res
        .status(400)
        .json({ message: "Either userId or guestId must be provided." });
    }

    // Find the cart associated with userId or guestId
    let cart = await Cart.findOne({
      $or: [{ userId: userId || null }, { guestId: finalGuestId || null }],
    });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        userId: userId || null,
        guestId: userId ? null : finalGuestId,
        products: [{ productId, quantity, color }],
      });
      await cart.save();

      return res.status(201).json({
        message: "Cart created and item added",
        cart,
      });
    }

    // Check if the product is already in the cart with the same color
    const existingProductIndex = cart.products.findIndex(
      (item) =>
        String(item.productId) === String(productId) && item.color === color
    );

    if (existingProductIndex !== -1) {
      // Update quantity if product exists
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product if not already in cart
      cart.products.push({ productId, quantity, color });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
/**
 * Retrieves the shopping cart for a user or guest based on the provided userId or guestId.
 *
 * This function checks if either a userId or guestId is provided in the query parameters.
 * If neither is provided, it returns a 400 status with an error message. If a cart is found,
 * it fetches the details of each product in the cart and returns them in the response.
 *
 * @async
 * @function getCart
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {string} [req.query.userId] - The ID of the user whose cart is to be retrieved.
 *                                       This is optional; if not provided, guestId should be used.
 * @param {string} [req.query.guestId] - The ID of the guest whose cart is to be retrieved.
 *                                        This is optional; if not provided, userId should be used.
 * @returns {Promise<void>} - Returns a JSON response with the cart details if found,
 *                            or an error message if not. The response structure includes:
 *                            - message: A string indicating success or failure.
 *                            - success: A boolean indicating the success status.
 *                            - cart: An object containing cartId and products if successful.
 * @throws {Error} - If there is a server error during the retrieval process, an error message
 *                   will be returned in the response with a 500 status.
 */
const getCart = async (req, res) => {
  try {
    const { userId, guestId } = req.query; // Get userId or guestId from query parameters

    if (!userId && !guestId) {
      return res.status(400).json({
        message: "Either userId or guestId is required",
        success: false,
      });
    }

    // Find the cart based on userId or guestId
    const query = {};
    if (userId) query.userId = userId;
    if (guestId) query.guestId = guestId;

    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Fetch product details manually
    const productsWithDetails = await Promise.all(
      //since we cant populate because we are using the harcoded productid which is a string, so we have to manually populate
      cart.products.map(async (item) => {
        const product = await Product.findOne({ productId: item.productId });

        return {
          productId: item.productId,
          name: product.name,
          category: product.category,
          roomType: product.roomType,
          tags: product.tags,
          price: product.price,
          color: item.color, // Use the color from the cart item
          images: product.images,
          dimensions: product.dimensions,
          weight: product.weight,
          material: product.material,
          materialsUsed: product.materialsUsed,
          sku: product.sku,
          inStock: product.inStock,
          colorStock: product.colorStock,
          quantity: item.quantity,
        };
      })
    );

    res.status(200).json({
      message: "Cart retrieved successfully",
      success: true,
      cart: {
        cartId: cart.cartId,
        products: productsWithDetails, //we will get the products with quantiy like an array in this
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
};
/**
 * Updates the quantity of a specific product in a cart.
 *
 * @function updateCartItemQuantity
 * @async
 *
 * @description
 * Handles updating cart item quantity with comprehensive logic:
 * - Validates cart, product IDs, and color
 * - Supports 'increase' and 'decrease' actions
 * - Automatically removes product if quantity reaches zero
 * - Uses MongoDB's $inc and $pull operators for efficient updates
 * - Ensures quantity updates are color-specific
 *
 * @route {PUT} /api/cart/update-quantity
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.cartId - Unique identifier of the cart
 * @param {string} req.body.productId - Unique identifier of the product to update
 * @param {string} req.body.color - Color of the specific product variant
 * @param {string} req.body.action - Action to perform ('increase' or 'decrease')
 *
 * @returns {Object} JSON response with:
 * - 200 status for successful quantity update
 * - 400 status for invalid input or action
 * - 404 status for cart or product not found
 * - 500 status for server errors
 *
 * @example
 * // Request Body (Increase Quantity)
 * {
 *   "cartId": "cart_123456",
 *   "productId": "prod_789012",
 *   "color": "Blue",
 *   "action": "increase"
 * }
 *
 * @example
 * // Request Body (Decrease Quantity)
 * {
 *   "cartId": "cart_123456",
 *   "productId": "prod_789012",
 *   "color": "Red",
 *   "action": "decrease"
 * }
 *
 * @example
 * // Successful Response
 * {
 *   "status": "success",
 *   "message": "Cart item quantity updated successfully",
 *   "data": {
 *     "cartId": "cart_123456",
 *     "products": [
 *       {
 *         "productId": "prod_789012",
 *         "color": "Blue",
 *         "quantity": 2
 *       }
 *     ]
 *   }
 * }
 *
 * @example
 * // Error Response (Product with Color Not Found)
 * {
 *   "status": "error",
 *   "message": "Product with specified color not found in cart"
 * }
 *
 * @throws {Error}
 * - Throws 400 error for missing or invalid parameters
 * - Throws 400 error for missing color
 * - Throws 404 error if cart or color-specific product doesn't exist
 * - Throws 500 error for unexpected server errors
 *
 * @note
 * This function allows updating quantities for specific color variants of a product,
 * enabling more granular cart management.
 */ /**
 * Updates the quantity of a specific product in a cart.
 *
 * @function updateCartItemQuantity
 * @async
 *
 * @description
 * Handles updating cart item quantity with comprehensive logic:
 * - Validates cart, product IDs, and color
 * - Supports 'increase' and 'decrease' actions
 * - Automatically removes product if quantity reaches zero
 * - Uses MongoDB's $inc and $pull operators for efficient updates
 * - Ensures quantity updates are color-specific
 *
 * @route {PUT} /api/cart/update-quantity
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.cartId - Unique identifier of the cart
 * @param {string} req.body.productId - Unique identifier of the product to update
 * @param {string} req.body.color - Color of the specific product variant
 * @param {string} req.body.action - Action to perform ('increase' or 'decrease')
 *
 * @returns {Object} JSON response with:
 * - 200 status for successful quantity update
 * - 400 status for invalid input or action
 * - 404 status for cart or product not found
 * - 500 status for server errors
 *
 * @example
 * // Request Body (Increase Quantity)
 * {
 *   "cartId": "cart_123456",
 *   "productId": "prod_789012",
 *   "color": "Blue",
 *   "action": "increase"
 * }
 *
 * @example
 * // Request Body (Decrease Quantity)
 * {
 *   "cartId": "cart_123456",
 *   "productId": "prod_789012",
 *   "color": "Red",
 *   "action": "decrease"
 * }
 *
 * @example
 * // Successful Response
 * {
 *   "status": "success",
 *   "message": "Cart item quantity updated successfully",
 *   "data": {
 *     "cartId": "cart_123456",
 *     "products": [
 *       {
 *         "productId": "prod_789012",
 *         "color": "Blue",
 *         "quantity": 2
 *       }
 *     ]
 *   }
 * }
 *
 * @example
 * // Error Response (Product with Color Not Found)
 * {
 *   "status": "error",
 *   "message": "Product with specified color not found in cart"
 * }
 *
 * @throws {Error}
 * - Throws 400 error for missing or invalid parameters
 * - Throws 400 error for missing color
 * - Throws 404 error if cart or color-specific product doesn't exist
 * - Throws 500 error for unexpected server errors
 *
 * @note
 * This function allows updating quantities for specific color variants of a product,
 * enabling more granular cart management.
 */
const updateCartItemQuantity = async (req, res) => {
  try {
    const { cartId, productId, action, color } = req.body;

    if (!cartId || !productId || !action || !color) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID, Product ID, color and action are required",
      });
    }

    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    // Find the index of the product in the cart, now considering both productId and color
    const existingProductIndex = cart.products.findIndex(
      (item) =>
        String(item.productId) === String(productId) && item.color === color
    );
    if (existingProductIndex === -1) {
      return res.status(400).json({
        status: "error",
        message: "Product with specified color not found in cart",
      });
    }

    const currentQuantity = cart.products[existingProductIndex].quantity;

    if (action === "increase") {
      const updatedCart = await Cart.findOneAndUpdate(
        {
          cartId,
          "products.productId": String(productId),
          "products.color": color,
        },
        { $inc: { "products.$.quantity": 1 } }, // Increment quantity
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        message: "Cart item quantity updated successfully",
        cart: updatedCart,
      });
    } else if (action === "decrease") {
      // Only allow decrease if current quantity is greater than 1
      if (currentQuantity <= 1) {
        return res.status(400).json({
          status: "error",
          message: "Quantity cannot be decreased below 1",
        });
      }

      const updatedCart = await Cart.findOneAndUpdate(
        {
          cartId,
          "products.productId": String(productId),
          "products.color": color,
        },
        { $inc: { "products.$.quantity": -1 } }, // Decrement quantity
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        message: "Cart item quantity updated successfully",
        cart: updatedCart,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid action",
      });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
/**
 * Removes a specific product from a cart.
 *
 * @function deleteCartProduct
 * @async
 *
 * @description
 * Handles the deletion of a product from a cart with comprehensive validation:
 * - Checks for required cart, product IDs, and color
 * - Verifies cart existence
 * - Confirms specific product variant is in the cart
 * - Removes the product using MongoDB's $pull operator
 * - Supports color-specific product deletion
 *
 * @route {DELETE} /api/cart/delete-product
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.cartId - Unique identifier of the cart
 * @param {string} req.body.productId - Unique identifier of the product to remove
 * @param {string} req.body.color - Color of the specific product variant to remove
 *
 * @returns {Object} JSON response with:
 * - 200 status for successful deletion
 * - 400 status for invalid input
 * - 404 status for cart or color-specific product not found
 * - 500 status for server errors
 *
 * @example
 * // Request Body
 * {
 *   "cartId": "cart_123456",
 *   "productId": "prod_789012",
 *   "color": "Blue"
 * }
 *
 * @example
 * // Successful Response
 * {
 *   "message": "Product removed from cart successfully",
 *   "success": true,
 *   "cart": {
 *     "cartId": "cart_123456",
 *     "products": [
 *       // Remaining products after deletion
 *       {
 *         "productId": "prod_789012",
 *         "color": "Red"
 *       }
 *     ]
 *   }
 * }
 *
 * @example
 * // Error Response (Product with Specific Color Not Found)
 * {
 *   "message": "Product with specified color not found in cart",
 *   "success": false
 * }
 *
 * @throws {Error}
 * - Throws 400 error if cart, product ID, or color is missing
 * - Throws 404 error if cart or color-specific product doesn't exist
 * - Throws 500 error for unexpected server errors
 *
 * @note
 * This function allows removing specific color variants of a product,
 * enabling more precise cart management and supporting multiple
 * color variants of the same product in a single cart.
 */
const deleteCartProduct = async (req, res) => {
  try {
    const { cartId, productId, color } = req.body;

    // Validate input
    if (!cartId || !productId || !color) {
      return res.status(400).json({
        message: "Cart ID ,color and Product ID are required",
        success: false,
      });
    }

    // Find the cart first
    const cart = await Cart.findOne({ cartId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    // Check if the product exists in the cart with the specified color
    const productExists = cart.products.some(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.color === color
    );

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found in cart",
        success: false,
      });
    }

    // Remove product using `$pull`
    const updatedCart = await Cart.findOneAndUpdate(
      { cartId },
      {
        $pull: {
          products: {
            productId: productId,
            color: color,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product removed from cart successfully",
      success: true,
      cart: updatedCart, // Return updated cart if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error deleting cart product",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItemQuantity,
  deleteCartProduct,
};
