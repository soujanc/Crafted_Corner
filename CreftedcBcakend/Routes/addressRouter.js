const express = require("express");
const router = express.Router();
const { addAddress,
    getAllAddress,
    setDefaultAddress,
    deleteAddress,} = require("../controllers/addressController");



/**
 * @route   GET /
 * @desc    Retrieve all addresses
 * @access  Private/Admin
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 * @returns {Array} List of all address documents
 *
 * @example
 * // Successful Response
 * [
 *   {
 *     _id: "123",
 *     name: "John Doe",
 *     street: "123 Main St",
 *     isDefault: true
 *   }
 * ]
 */
router.get("/",  getAllAddress);

/**
 * @route   POST /
 * @desc    Create a new address
 * @access  Private
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Address creation payload
 * @param {string} req.body.name - Full name for the address
 * @param {string} req.body.street - Street address
 * @param {boolean} [req.body.isDefault] - Flag to set as default address
 *
 * @returns {Object} Newly created address document
 *
 * @example
 * // Request Body
 * {
 *   name: "John Doe",
 *   street: "123 Main St",
 *   isDefault: true
 * }
 *
 * // Successful Response
 * {
 *   message: "Address added successfully",
 *   address: {
 *     _id: "123",
 *     name: "John Doe",
 *     street: "123 Main St"
 *   }
 * }
 */
router.post("/",  addAddress);

/**
 * @route   PUT /set-default
 * @desc    Set a specific address as default
 * @access  Private
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Default address payload
 * @param {string} req.body.addressId - Unique identifier of address to set as default
 *
 * @returns {Object} Updated address document
 *
 * @example
 * // Request Body
 * {
 *   addressId: "123"
 * }
 *
 * // Successful Response
 * {
 *   message: "Default address updated successfully",
 *   address: {
 *     _id: "123",
 *     isDefault: true
 *   }
 * }
 */
router.put("/setdefault",setDefaultAddress);

/**
 * @route   DELETE /:addressId
 * @desc    Delete a specific address
 * @access  Private
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.addressId - Unique identifier of address to delete
 *
 * @returns {Object} Deletion confirmation and details
 *
 * @example
 * // Successful Response
 * {
 *   message: "Address deleted successfully",
 *   deletedAddress: {
 *     _id: "123",
 *     name: "John Doe"
 *   },
 *   defaultAddressChanged: false
 * }
 */
router.delete("/:addressId", deleteAddress);

module.exports = router;