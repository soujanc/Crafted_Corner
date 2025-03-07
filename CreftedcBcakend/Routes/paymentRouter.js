const express = require("express");

/** Express router for handling order-related routes */
const router = express.Router();

const { getpayment } = require("../controllers/stripeController"); //import the controller

/**
 * Creates Stripe payment intent route
 * @route POST /create-payment-intent
 * @param {Function} getpayment - Stripe payment controller
 */
router.post("/create-payment-intent", getpayment);

module.exports = router; //export the router
