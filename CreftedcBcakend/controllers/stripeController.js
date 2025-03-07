const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51QlthVHjzz3ZRfG0u42tFKCGr8bBOcqKB7eBcOsxtP5VRzFDC8DkcwZfdwCDg0OOCjN50HHiPjoNSNiI6iyxoGi500JbC8taP1"
);

const getpayment = asyncHandler(async (req, res) => {
  console.log("Payment intent route hit!");
  console.log("Request body:", req.body);
  const taxRate = 0.08;
  // Correctly extract items from req.body
  const { items } = req.body;
  /**
   * Calculates the total pricing for a set of items
   * @function calculatePricing
   * @param {Array} items - Array of items to calculate pricing for
   *
   * @description
   * Computes the total price for a set of items, including:
   * - Subtotal of all items
   * - Tax calculation
   * - Shipping cost based on shipping method
   *
   * @workflow
   * 1. Calculate subtotal by multiplying price and quantity for each item
   * 2. Apply tax rate to subtotal
   * 3. Determine shipping cost based on shipping method
   * 4. Convert total to cents for Stripe payment
   *
   * @calculations
   * - Subtotal: Sum of (item price * item quantity)
   * - Tax: Subtotal * tax rate (8%)
   * - Shipping:
   *   - Standard shipping: $5
   *   - Express shipping: $15
   * - Total: (Subtotal + Tax + Shipping) * 100 (converted to cents)
   *
   * @example
   * // Example item structure
   * const items = [
   *   {
   *     productprice: 399.99,
   *     quantity: 1,
   *     shippingMethod: 'standard'
   *   }
   * ];
   *
   * const total = calculatePricing(items);
   * // Returns total in cents
   *
   * @returns {number} Total price in cents
   *
   * @throws {Error} If items array is empty or invalid
   *
   * @complexity O(n) - Linear time complexity based on number of items
   *
   * @see Stripe Payment Integration
   */
  const calculatePricing = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.productprice) * Number(item.quantity),
      0
    );
    console.log("subtotal", subtotal);
    const tax = subtotal * taxRate;
    console.log("tax", tax);
    // Get shipping cost based on the first item's shipping method
    const shippingCost =
      items.length > 0 ? (items[0].shippingMethod === "express" ? 15 : 5) : 0;
    console.log("shipping cost", shippingCost);
    // Calculate total in cents
    const total = Math.round((subtotal + tax + shippingCost) * 100);
    console.log("total", total);
    return total;
  };

  //calling the calculatepricing function to condole total amount
  const totalAmount = calculatePricing(items);
  console.log("total amount", totalAmount);

  /**
   * Creates a Stripe Payment Intent for processing customer payments
   * @async
   * @function createPaymentIntent
   *
   * @description
   * Generates a Stripe Payment Intent with the following characteristics:
   * - Calculates total amount dynamically based on cart items
   * - Supports multiple payment methods
   * - Generates a client secret for frontend payment confirmation
   *
   * @workflow
   * 1. Calculate total amount using calculatePricing function
   * 2. Create Stripe Payment Intent with calculated amount
   * 3. Enable automatic payment methods
   * 4. Send client secret back to frontend
   *
   * @param {Array} items - Array of items in the customer's cart
   *
   * @stripe-configuration
   * - Currency: USD
   * - Amount: Dynamically calculated in cents
   * - Automatic Payment Methods: Enabled
   *
   * @returns {Object} Payment intent response with client secret
   *
   * @example
   * const paymentIntent = await stripe.paymentIntents.create({
   *   amount: calculatePricing(items),
   *   currency: "usd",
   *   automatic_payment_methods: { enabled: true }
   * });
   *
   * @throws {StripeError} If payment intent creation fails
   *
   * @see https://stripe.com/docs/api/payment_intents/create
   * @see calculatePricing
   */
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculatePricing(items),
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = { getpayment };
