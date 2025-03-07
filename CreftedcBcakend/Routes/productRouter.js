const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    addSingleProduct,
    addMultipleProducts,
    addColorStockToAllProducts
} = require("../controllers/productController");

// streucture of queriys /api/products?key1=value1&key2=value2&key3=value3


/**
 * @route   GET /api/products
 * @desc    Retrieve products with optional filtering
 * @access  Public
 * 
 * @example
 * // Fetch all products
 * GET /api/products
 * 
 * // Fetch products by category
 * GET /api/products?category=Office Chair
 * 
 * // Fetch products by tags
 * GET /api/products?tags=Popular
 * 
 * // Fetch products by room type
 * GET /api/products?roomType=Living Room
 * 
 * // Combine multiple filters
 * GET /api/products?category=Office Chair&tags=Popular&roomType=Office
 */
router.get("/", getProducts);





router.get("/:productId", getProductById);



/**
 * @route   POST /api/products/single
 * @desc    Add a single product to the database
 * @access  Private/Admin
 * 
 * @example
 * // Request Body
 * {
 *   "productId": "IXCHAIR22349",
 *   "name": "Ergonomic Office Chair",
 *   "category": "Office Chair",
 *   "roomType": "Office",
 *   "price": 299.99,
 *   "quantity": 50,
 *   "color": "Black",
 *   "material": "Leather and Steel",
 *   "sku": "OFFCH-005-BLK",
 *   "inStock": true
 * }
 */
router.post("/single", addSingleProduct);



/**
 * @route   POST /api/products/multiple
 * @desc    Add multiple products to the database in a single operation
 * @access  Private/Admin
 * 
 * @example
 * // Request Body (Array of product objects)
 * [
 *   {
 *     "productId": "IXCHAIR22349",
 *     "name": "Ergonomic Office Chair",
 *     "category": "Office Chair",
 *     "roomType": "Office",
 *     "price": 299.99,
 *     "quantity": 50
 *   },
 *   {
 *     "productId": "SOFA22350",
 *     "name": "Modern Living Room Sofa",
 *     "category": "Furniture",
 *     "roomType": "Living Room",
 *     "price": 599.99,
 *     "quantity": 20
 *   }
 * ]
 */
router.post("/multiple", addMultipleProducts);


router.post("/add-color-stock", addColorStockToAllProducts);

module.exports = router;