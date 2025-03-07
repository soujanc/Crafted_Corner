const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Product = require("../Models/ProductModel");

// streucture of queriys /api/products?key1=value1&key2=value2&key3=value3

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Retrieves products with optional filtering
 *
 * @function getProducts
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters for filtering products
 * @param {string} [req.query.category] - Filter products by category
 * @param {string} [req.query.tags] - Filter products by tags
 * @param {string} [req.query.roomType] - Filter products by room type
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response containing:
 * - {Array<Object>} products - Array of matching product documents
 *
 * @throws {404} No products found matching the criteria
 * @throws {500} Internal server error during product retrieval
 *
 * @description
 * Fetches products from the database with optional filtering.
 * Supports filtering by category, tags, and room type.
 * Returns all products if no filters are applied.
 *
 * @example
 * // API Call Examples:
 *
 * // 1. Fetch all products
 * GET /api/products
 *
 * // 2. Fetch products by category
 * GET /api/products?category=Office Chair
 *
 * // 3. Fetch products by tags
 * GET /api/products?tags=Popular
 *
 * // 4. Fetch products by room type
 * GET /api/products?roomType=Living Room
 *
 * // 5. Combine multiple filters
 * GET /api/products?category=Office Chair&tags=Popular&roomType=Office
 *
 * @example
 * // Successful Response
 * {
 *   "products": [
 *     {
 *       "productId": "IXCHAIR22349",
 *       "name": "Ergonomic Office Chair",
 *       "category": "Office Chair",
 *       "roomType": "Office",
 *       "tags": "Popular",
 *       "price": 299.99
 *     },
 *     // ... more products
 *   ]
 * }
 *
 * @example
 * // No Products Found Response
 * {
 *   "message": "No products found matching the specified criteria"
 * }
 *
 * @example
 * // Error Response
 * {
 *   "message": "An error occurred while fetching products",
 *   "error": "Detailed error message"
 * }
 */
const getProducts = asyncHandler(async (req, res) => {
  const { category, tags, roomType } = req.query;
  const filter = {};

  if (category) {
    filter.category = category; //dynamically cretas a subsection filter.category eventhough filter started out as an empty array  so it becomes___ filter = { category: "electronics" }; this is then applied in find(filter) which is essentially becomes Product.find({ category: "electronics" });
  }

  if (tags) {
    //same as above
    filter.tags = tags;
  }

  if (roomType) {
    filter.roomType = roomType;
  }
  try {
    const products = await Product.find(filter); //in case of mulitple filter it will look like filter.find({ category: "electronics", tags: "popular", roomType: "living room" })

    // Optional: Add a check for empty results
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found matching the specified criteria",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching products:", error);

    // Send a generic error response
    res.status(500).json({
      message: "An error occurred while fetching products",
      error: error.message,
    });
  }
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Retrieves a specific product by its unique product ID
 *
 * @function getProductById
 * @async
 *
 * @description
 * Fetches a single product using its custom productId with optional population of related fields.
 * Provides detailed error handling and logging for various scenarios.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.productId - Unique identifier for the product
 *
 * @param {Object} res - Express response object
 *
 * @returns {Object} JSON response containing:
 * - product: Detailed product information
 * - relatedProducts: Array of products in the same category
 *
 * @workflow
 * 1. Extract productId from request parameters
 * 2. Attempt to find product by productId
 * 3. Populate related fields (category, related products)
 * 4. Find related products in the same category
 * 5. Return product details and related products
 *
 * @throws {404} Product not found
 * @throws {500} Server error during product retrieval
 *
 * @example
 * // Successful Response
 * {
 *   product: {
 *     productId: "CHAIR001",
 *     name: "Ergonomic Chair",
 *     category: "Office Furniture"
 *   },
 *   relatedProducts: [
 *     { productId: "CHAIR002", name: "Executive Chair" },
 *     // ... more related products
 *   ]
 * }
 *
 * @example
 * // Error Response
 * {
 *   message: "Product not found",
 *   productId: "INVALID_ID"
 * }
 */
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params; // Extract productId from request parameters

  try {
    // Find the product by custom productId
    const product = await Product.findOne({ productId })
      .populate("category") // Optional: populate related category
      .populate("relatedProducts"); // Optional: populate related products

    // Handle case when no product is found
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        productId: productId,
      });
    }

    // Find additional related products dynamically
    const relatedProducts = await Product.find({
      category: product.category, // Same category
      productId: { $ne: product.productId }, // Exclude current product
      inStock: true, // Only in-stock products
    }).limit(4); // Limit to 4 related products

    // Successful response with product and related products
    res.status(200).json({
      product,
      relatedProducts,
    });
  } catch (error) {
    // Detailed error logging
    console.error("Error fetching product by ID:", {
      productId: productId,
      errorMessage: error.message,
      errorStack: error.stack,
    });

    // Send detailed error response
    res.status(500).json({
      message: "An error occurred while fetching the product",
      error: error.message,
      productId: productId,
    });
  }
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Adds a single product to the database
 *
 * @function addSingleProduct
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Product object to be added
 * @param {string} req.body.productId - Unique identifier for the product
 * @param {string} req.body.name - Name of the product
 * @param {string} req.body.category - Category of the product
 * @param {string} req.body.roomType - Room type where the product is suitable
 * @param {string} [req.body.tags] - Optional tags for the product
 * @param {number} req.body.price - Price of the product
 * @param {number} req.body.quantity - Available quantity of the product
 * @param {Object} [req.body.dimensions] - Dimensions of the product
 * @param {string} [req.body.weight] - Weight of the product
 * @param {string} req.body.color - Color of the product
 * @param {string[]} [req.body.images] - Array of image URLs
 * @param {string} req.body.material - Primary material of the product
 * @param {string} req.body.materialsUsed - Description of materials used
 * @param {string} req.body.sku - Stock Keeping Unit
 * @param {boolean} req.body.inStock - Availability status of the product
 * @param {Object} res - Express response object
 *
 * @throws {Error} 400 - If any required field is missing
 * @throws {Error} 409 - If a product with the same productId already exists
 *
 * @returns {Object} JSON response containing:
 * - {string} message - Success message
 * - {Object} product - The newly created product document
 *
 * @description
 * This controller method performs a comprehensive validation and creation of a single product:
 * 1. Validates the presence of all required fields
 * 2. Checks for existing products with the same productId
 * 3. Creates a new product using Mongoose's create method
 * 4. Ensures the product is saved to the database
 *
 * @example
 * // Request body
 * {
 *   productId: "IXCHAIR22349",
 *   name: "Ergonomic Office Chair",
 *   category: "Office Chair",
 *   roomType: "Office",
 *   tags: "Popular",
 *   price: 299.99,
 *   quantity: 50,
 *   color: "Black",
 *   dimensions: {
 *     height: "110 cm",
 *     width: "65 cm",
 *     depth: "60 cm"
 *   },
 *   weight: "15 kg",
 *   material: "Leather and Steel",
 *   materialsUsed: "High-quality leather and stainless steel",
 *   sku: "OFFCH-005-BLK",
 *   inStock: true,
 *   images: [
 *     "/images/chair1.jpg",
 *     "/images/chair2.jpg"
 *   ]
 * }
 *
 * @example
 * // Successful Response
 * {
 *   message: "Product added successfully",
 *   product: {
 *     // Full product document as saved in the database
 *   }
 * }
 *
 * @example
 * // Error Response (Missing Fields)
 * {
 *   message: "All required fields are mandatory"
 * }
 *
 * @example
 * // Error Response (Duplicate Product)
 * {
 *   message: "Product with ID IXCHAIR22349 already exists"
 * }
 */
const addSingleProduct = asyncHandler(async (req, res) => {
  const {
    productId,
    name,
    category,
    roomType,
    tags,
    price,
    quantity,
    dimensions,
    weight,
    color,
    images,
    material,
    materialsUsed,
    sku,
    inStock,
  } = req.body;

  // Validate required fields
  if (
    !productId ||
    !name ||
    !category ||
    !price ||
    !quantity ||
    !color ||
    !material ||
    !sku ||
    !inStock ||
    !roomType ||
    !materialsUsed
  ) {
    res.status(400);
    throw new Error("All required fields are mandatory");
  }

  try {
    // Check if a product with the same productId already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      res.status(409);
      throw new Error(`Product with ID ${productId} already exists`);
    }

    // Create the product
    const product = await Product.create({
      productId,
      name,
      category,
      roomType,
      tags,
      price,
      quantity,
      color,
      dimensions,
      weight,
      material,
      materialsUsed,
      images,
      sku,
      inStock,
    });

    // Ensure the product is saved before responding
    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    // Handle any errors during product creation
    res.status(error.status || 500);
    throw new Error(error.message || "Error creating product");
  }
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Adds multiple products to the database in a single operation
 *
 * @function addMultipleProducts
 * @async
 * @param {Object} req - Express request object
 * @param {Array<Object>} req.body - Array of product objects to be added
 * @param {Object} res - Express response object
 *
 * @throws {Error} 400 - If the request body is not an array or is empty
 * @throws {Error} 400 - If any product is missing required fields
 * @throws {Error} 409 - If any product with the same productId or SKU already exists
 *
 * @returns {Object} JSON response containing:
 * - {string} message - Success message with number of products added
 * - {Array<Object>} products - The successfully inserted products
 *
 * @description
 * This controller method performs a bulk insertion of products with comprehensive validation:
 * 1. Checks if the input is a non-empty array
 * 2. Validates each product for required fields
 * 3. Checks for duplicate productIds or SKUs in the database
 * 4. Inserts valid, unique products using Mongoose's insertMany method
 *
 * @example
 * // Request body
 * [
 *   {
 *     productId: "IXCHAIR22349",
 *     name: "Ergonomic Office Chair",
 *     category: "Office Chair",
 *     price: 299.99,
 *     quantity: 50,
 *     color: "Black",
 *     material: "Leather and Steel",
 *     sku: "OFFCH-005-BLK",
 *     inStock: true,
 *     roomType: "Office",
 *     materialsUsed: "High-quality leather"
 *   },
 *   // ... more products
 * ]
 *
 * @example
 * // Successful Response
 * {
 *   message: "2 products added successfully",
 *   products: [
 *     // Array of inserted product documents
 *   ]
 * }
 *
 * @example
 * // Validation Error Response
 * {
 *   message: "Some products failed validation",
 *   errors: [
 *     {
 *       productId: "IXCHAIR22349",
 *       missingFields: ["name", "price"]
 *     }
 *   ]
 * }
 *
 * @example
 * // Duplicate Error Response
 * {
 *   message: "Some products already exist",
 *   duplicates: [
 *     {
 *       productId: "IXCHAIR22349",
 *       sku: "OFFCH-005-BLK"
 *     }
 *   ]
 * }
 */
const addMultipleProducts = asyncHandler(async (req, res) => {
  const products = req.body; // Expecting an array of product objects

  // Validate that input is an array
  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Request body must be an array of products");
  }

  // Validate each product
  const validationErrors = [];
  const productsToInsert = products.filter((product) => {
    const requiredFields = [
      "productId",
      "name",
      "category",
      "price",
      "quantity",
      "color",
      "material",
      "sku",
      "inStock",
      "roomType",
      "materialsUsed",
    ];

    const missingFields = requiredFields.filter((field) => !product[field]);

    if (missingFields.length > 0) {
      validationErrors.push({
        productId: product.productId,
        missingFields: missingFields,
      });
      return false;
    }
    return true;
  });

  // If any products fail validation, return error details
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(
      JSON.stringify({
        message: "Some products failed validation",
        errors: validationErrors,
      })
    );
  }

  try {
    // Check for duplicate productIds or SKUs before insertion
    const existingProducts = await Product.find({
      $or: [
        { productId: { $in: productsToInsert.map((p) => p.productId) } },
        { sku: { $in: productsToInsert.map((p) => p.sku) } },
      ],
    });

    if (existingProducts.length > 0) {
      const duplicates = existingProducts.map((p) => ({
        productId: p.productId,
        sku: p.sku,
      }));

      res.status(409);
      throw new Error(
        JSON.stringify({
          message: "Some products already exist",
          duplicates: duplicates,
        })
      );
    }

    // Insert multiple products
    const insertedProducts = await Product.insertMany(productsToInsert);

    res.status(201).json({
      message: `${insertedProducts.length} products added successfully`,
      products: insertedProducts,
    });
  } catch (error) {
    // Handle mongoose errors
    res.status(error.status || 500);
    throw new Error(error.message || "Error creating products");
  }
});

//temporrary function
const addColorStockToAllProducts = asyncHandler(async (req, res) => {
  try {
    const result = await Product.updateMany(
      {}, // Match all documents
      {
        $set: {
          colorStock: ["beige", "gray", "black"],
        },
      },
      { new: true } // Return the updated documents
    );

    // Verify the update by fetching a sample product
    const sampleProduct = await Product.findOne({});
    console.log("Sample Product After Update:", {
      _id: sampleProduct._id,
      colorStock: sampleProduct.colorStock,
    });

    res.status(200).json({
      success: true,
      message: "Color stock added to all products",
      modifiedCount: result.modifiedCount,
      sampleProduct: {
        _id: sampleProduct._id,
        colorStock: sampleProduct.colorStock,
      },
    });
  } catch (error) {
    console.error("Error adding color stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add color stock to products",
      error: error.message,
    });
  }
});

module.exports = {
  getProducts,
  getProductById,
  addSingleProduct,
  addMultipleProducts,
  addColorStockToAllProducts,
};
