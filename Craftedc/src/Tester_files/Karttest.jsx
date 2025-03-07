import React, { useReducer, useState, useEffect } from "react";
import {
  kartReducer,
  initialKartState,
  addToCart,
  getCart,
  updateCartItemQuantity,
  deleteCartItem,
} from "../Reducers/KartReducer";

const Karttest = () => {
  const [state, dispatch] = useReducer(kartReducer, initialKartState);
  const [testProduct, setTestProduct] = useState({
    productId: "PROD002", // Replace with an actual product ID from your database
    quantity: 2,
    color: "Blue",
  });
  const [testCartId, setTestCartId] = useState(null);
  const [testResults, setTestResults] = useState({
    addToCart: null,
    getCart: null,
    updateQuantity: null,
    deleteItem: null,
  });
  const runCartTests = async () => {
    try {
      // Test 1: Add to Cart
      const addResult = await addToCart(dispatch, testProduct);
      console.log("Add to Cart Result:", addResult);
      setTestResults((prev) => ({ ...prev, addToCart: addResult }));

      // Store the cart ID for subsequent tests
      if (addResult && addResult.cartId) {
        setTestCartId(addResult.cartId);

        // Test 2: Get Cart
        const getCartResult = await getCart(dispatch, addResult.cartId);
        console.log("Get Cart Result:", getCartResult);
        setTestResults((prev) => ({ ...prev, getCart: getCartResult }));

        // Test 3: Update Quantity
        const updateResult = await updateCartItemQuantity(dispatch, {
          cartId: addResult.cartId,
          productId: testProduct.productId,
          color: testProduct.color,
          action: "increase",
        });
        console.log("Update Quantity Result:", updateResult);
        setTestResults((prev) => ({ ...prev, updateQuantity: updateResult }));

        // Test 4: Delete Cart Item
        const deleteResult = await deleteCartItem(dispatch, {
          cartId: addResult.cartId,
          productId: testProduct.productId,
          color: testProduct.color,
        });
        console.log("Delete Item Result:", deleteResult);
        setTestResults((prev) => ({ ...prev, deleteItem: deleteResult }));
      }
    } catch (error) {
      console.error("Cart Test Error:", error);
    }
  };
  return (
    <div className="container mx-auto min-h-screen bg-gray-100 p-6">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
          🛒 Cart Reducer Test
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Test Product Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Test Product
            </h2>
            <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
              {JSON.stringify(testProduct, null, 2)}
            </pre>
          </div>

          {/* Reducer State Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Reducer State
            </h2>
            <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        </div>

        {/* Test Results Section */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Test Results
          </h2>
          <pre className="overflow-x-auto rounded-md bg-gray-100 p-3 text-sm">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>

        {/* Test Button */}
        <div className="mt-6 text-center">
          <button
            onClick={runCartTests}
            className="transform rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Run Cart Tests
          </button>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h2 className="mb-4 text-xl font-semibold text-red-700">Error</h2>
            <pre className="overflow-x-auto rounded-md bg-red-100 p-3 text-sm text-red-800">
              {JSON.stringify(state.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Karttest;
