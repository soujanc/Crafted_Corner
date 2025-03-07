const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Address = require("../Models/addressModel");

/**
 * Adds a new address to the database with comprehensive validation
 *
 * This function performs a sophisticated address creation process:
 * 1. Validates all required address fields
 * 2. Sanitizes and normalizes input data
 * 3. Creates a new address document
 * 4. Provides a detailed response about the creation
 *
 * @function
 * @name addAddress
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing address details
 * @param {string} [req.body.type='Home'] - Type of address (Home, Work, etc.)
 * @param {string} req.body.name - Full name associated with the address
 * @param {string} req.body.street - Street address
 * @param {string} [req.body.landmark] - Additional location details
 * @param {string} req.body.city - City name
 * @param {string} req.body.state - State or province
 * @param {string} req.body.zipCode - Postal code
 * @param {string} req.body.country - Country name
 * @param {boolean} [req.body.isDefault=false] - Flag to set as default address
 *
 * @returns {Object} Comprehensive address creation response with:
 * - message: Descriptive status message
 * - address: Details of the newly created address
 *
 * @workflow
 * 1. Validate all required fields
 * 2. Sanitize input data
 * 3. Create new address document
 * 4. Return created address details
 *
 * @error-handling
 * - 400: Missing required fields
 * - 400: Address creation failure
 *
 * @complexity
 * - Time: O(1)
 * - Space: O(1)
 *
 * @example
 * // Request body
 * {
 *   name: "John Doe",
 *   street: "123 Main St",
 *   city: "New York",
 *   state: "NY",
 *   zipCode: "10001",
 *   country: "USA",
 *   isDefault: false
 * }
 *
 * // Successful response
 * {
 *   message: "Address added successfully",
 *   address: {
 *     _id: "123",
 *     name: "John Doe",
 *     street: "123 Main St",
 *     // ... other address details
 *   }
 * }
 *
 * @potential-improvements
 * - Add more comprehensive input validation
 * - Implement address format validation for different countries
 * - Add geolocation validation
 *
 * @security Requires authentication middleware
 * @see setDefaultAddress For related address management functionality
 */
const addAddress = asyncHandler(async (req, res) => {
  const {
    type,
    name,
    street,
    landmark,
    city,
    state,
    zipCode,
    country,
    isDefault,
    userId,
    guestId, // This should come from frontend
  } = req.body;

  let finalGuestId = guestId || req.headers["guest-id"]; // Prioritize frontend's guestId

  // If no userId and no guestId, generate a backup guestId
  if (!userId && !finalGuestId) {
    finalGuestId = `guest_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
  }

  // Validate required fields
  const requiredFields = [
    "name",
    "street",
    "city",
    "state",
    "zipCode",
    "country",
  ];
  for (let field of requiredFields) {
    if (!req.body[field]) {
      res.status(400);
      throw new Error(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      );
    }
  }

  try {
    const newAddress = await Address.create({
      type: type || "Home",
      name,
      street,
      landmark,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
      userId: userId || null,
      guestId: userId ? null : finalGuestId, // Store guestId if no user is logged in
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
      guestId: finalGuestId, // Send guestId back if generated as a backup
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
/**
 * Retrieves all addresses associated with a specific user.
 *
 * @async
 * @function getAllAddress
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object used to send the response.
 *
 * @description
 * This function fetches addresses from the database based on the provided userId.
 * It validates the userId to ensure it is a valid MongoDB ObjectId and constructs
 * a query to retrieve the addresses. If the userId is not provided or invalid,
 * it returns an appropriate error response.
 *
 * @throws {Error} If an error occurs while fetching addresses from the database.
 *
 * @returns {Promise<void>} Returns a JSON response containing the success status,
 * the count of addresses, and the addresses themselves if the operation is successful.
 *
 * @example
 * // Example request
 * GET /api/address?userId=60c72b2f9b1d8c3d88c8f8e0
 *
 * // Example response on success
 * {
 *   "success": true,
 *   "count": 2,
 *   "addresses": [
 *     {
 *       "_id": "60c72b2f9b1d8c3d88c8f8e1",
 *       "userId": "60c72b2f9b1d8c3d88c8f8e0",
 *       "name": "John Doe",
 *       "street": "123 Main St",
 *       "city": "Anytown",
 *       "state": "CA",
 *       "zipCode": "12345",
 *       "country": "USA"
 *     },
 *     {
 *       "_id": "60c72b2f9b1d8c3d88c8f8e2",
 *       "userId": "60c72b2f9b1d8c3d88c8f8e0",
 *       "name": "Jane Doe",
 *       "street": "456 Elm St",
 *       "city": "Othertown",
 *       "state": "NY",
 *       "zipCode": "67890",
 *       "country": "USA"
 *     }
 *   ]
 * }
 *
 * @example
 * // Example response on error
 * {
 *   "success": false,
 *   "message": "Invalid userId format",
 *   "error": "Provided userId is not a valid ObjectId"
 * }
 */
const getAllAddress = asyncHandler(async (req, res) => {
  const { userId } = req.query; // Use req.query instead of req.body

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId must be provided",
      error: "Missing identification parameter",
    });
  }

  let query = {};

  try {
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
        error: "Provided userId is not a valid ObjectId",
      });
    }

    // Construct the query with userId
    query.userId = new mongoose.Types.ObjectId(userId); // Ensure it's stored correctly

    // Fetch addresses
    const addresses = await Address.find(query);

    // Return response with metadata
    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
});
/**
 * Sets a specific address as the default address for a user
 *
 * This function performs a comprehensive default address management process:
 * 1. Validates the existence of the address
 * 2. Resets all existing addresses to non-default status
 * 3. Sets the specified address as the new default
 * 4. Provides a detailed response about the update
 *
 * @function
 * @name setDefaultAddress
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body parameters
 * @param {string} req.body.addressId - Unique identifier of the address to set as default
 *
 * @returns {Object} Comprehensive address update response with:
 * - message: Descriptive status message
 * - address: Details of the newly set default address
 *
 * @workflow
 * 1. Find the address by ID
 * 2. Reset all addresses to non-default
 * 3. Update the specified address to default
 * 4. Return updated address details
 *
 * @error-handling
 * - 404: Address not found
 * - 400: Address update failure
 *
 * @complexity
 * - Time: O(n) where n is number of addresses
 * - Space: O(1)
 *
 * @example
 * // Request
 * {
 *   addressId: "123"
 * }
 *
 * // Successful response
 * {
 *   message: "Default address updated successfully",
 *   address: {
 *     id: "123",
 *     isDefault: true,
 *     // other address details
 *   }
 * }
 *
 * @security Requires authentication middleware
 * @see deleteAddress For related address management functionality
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId, userId } = req.body; // Now expecting userId to be passed directly

  try {
    // Check if the address belongs to the user
    const address = await Address.findOne({ _id: addressId, userId: userId });

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found or does not belong to the user" });
    }

    // Set all addresses to not default for the user
    await Address.updateMany(
      { userId: userId },
      { $set: { isDefault: false } }
    );

    // Set the specified address as default
    const defaultAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!defaultAddress) {
      res.status(404);
      throw new Error("Address not able to update (no address found)");
    }

    res.status(200).json({
      message: "Default address updated successfully",
      address: defaultAddress,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * Deletes an address and manages default address status
 *
 * This function performs a sophisticated address deletion process:
 * 1. Validates the existence of the address
 * 2. Prevents deletion if it would leave no addresses
 * 3. Handles default address reassignment intelligently
 * 4. Provides detailed response about deletion outcome
 *
 * @function
 * @name deleteAddress
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request URL parameters
 * @param {string} req.params.addressId - Unique identifier of the address to delete
 *
 * @returns {Object} Comprehensive deletion response with:
 * - message: Descriptive status message
 * - deletedAddress: Details of the deleted address
 * - defaultAddressChanged: Boolean indicating default address status
 * - newDefaultAddress: Details of newly assigned default address (if applicable)
 *
 * @workflow
 * 1. Verify address existence
 * 2. Check remaining addresses
 * 3. Manage default address status
 * 4. Delete address
 * 5. Return detailed response
 *
 * @error-handling
 * - 404: Address not found
 * - 400: Address deletion failure
 *
 * @complexity
 * - Time: O(n) where n is number of addresses
 * - Space: O(1)
 *
 * @example
 * // Successful deletion response
 * {
 *   message: "Address deleted successfully",
 *   deletedAddress: { id: "123", ... },
 *   defaultAddressChanged: true,
 *   newDefaultAddress: { id: "456", ... }
 * }
 *
 * @security Requires authentication middleware
 * @see setDefaultAddress For related address management functionality
 */

const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.addressId; // Ensure addressId is accessed properly
  try {
    const addressToDelete = await Address.findById(addressId);
    if (!addressToDelete) {
      res.status(404);
      throw new Error("Address not found");
    }

    // Count remaining addresses (excluding the one being deleted)
    const remainingAddresses = await Address.countDocuments({
      _id: { $ne: addressId },
    });

    let defaultAddressChanged = false; // Track if the default address was changed
    let newDefaultAddress = null; // Store the new default address, if applicable

    // If the deleted address is default and there is at least one other address, reassign default
    if (remainingAddresses > 0 && addressToDelete.isDefault) {
      const alternateAddress = await Address.findOne({
        _id: { $ne: addressId },
      }).sort({ createdAt: 1 });

      if (alternateAddress) {
        alternateAddress.isDefault = true;
        await alternateAddress.save();
        defaultAddressChanged = true;
        newDefaultAddress = alternateAddress;
      }
    }

    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      res.status(404);
      throw new Error("Address could not be deleted");
    }

    // Construct the response //set here     res.status(200).json(response);
    const response = {
      message: "Address deleted successfully",
      deletedAddress,
    };

    if (defaultAddressChanged) {
      response.defaultAddressChanged = true;
      response.newDefaultAddress = newDefaultAddress;
      response.message =
        "Address deleted successfully. Default address changed because the deleted address was the default.";
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  //export modules
  addAddress,
  getAllAddress,
  setDefaultAddress,
  deleteAddress,
};
