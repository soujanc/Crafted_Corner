import React from "react";
import { useState, useEffect, useReducer } from "react";
import {
  orderReducer,
  initialOrderState,
  useOrderActions,
} from "../Reducers/Ordereducers";

export default function OrderTester() {
  const [state, dispatch] = useReducer(orderReducer, {
    ...initialOrderState,
    orders: [],
    filteredOrders: [],
  });

  const { fetchOrders, sortOrder } = useOrderActions(dispatch);

  // State to track UI interactions
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock orders for testing if backend is not available
  const mockOrders = [
    {
      _id: "1",
      date: new Date("2024-02-10").toISOString(),
      orderStatus: "delivered",
      totalAmount: 100.5,
    },
    {
      _id: "2",
      date: new Date("2024-01-15").toISOString(),
      orderStatus: "shipped",
      totalAmount: 250.75,
    },
    {
      _id: "3",
      date: new Date("2024-02-01").toISOString(),
      orderStatus: "out for delivery",
      totalAmount: 75.25,
    },
    {
      _id: "4",
      date: new Date("2023-12-20").toISOString(),
      orderStatus: "delivered",
      totalAmount: 300.0,
    },
  ];

  // Fetch orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Dispatch mock orders if fetchOrders fails
        await fetchOrders();
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    loadOrders();
  }, []);

  // Handler for filter selection
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    sortOrder(filter);
  };

  // Filters for testing
  const filterOptions = [
    "all",
    "last7Days",
    "lastMonth",
    "last3Months",
    "Delivered",
    "Shipped",
    "out for delivery",
    "pending",
  ];

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 px-4 py-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-2xl font-bold">Order Management Tester</h2>
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-100 p-4">
          <h3 className="mb-4 text-lg font-semibold">Filter Options</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Summary */}
        <div className="border-b bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total Orders:</p>
              <p className="text-xl font-bold text-blue-600">
                {state.filteredOrders?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Current Filter:</p>
              <p className="text-xl font-bold text-blue-600">
                {selectedFilter}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-100">
              <tr>
                {["Order ID", "Date", "Status", "Total Amount"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {state.filteredOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4">{order._id}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.orderStatus === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      } `}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Debugging Section */}
        <div className="mt-4 bg-gray-100 p-4">
          <h3 className="mb-2 text-lg font-semibold">Debug Information</h3>
          <pre className="overflow-x-auto rounded-md bg-white p-4 text-sm text-gray-700">
            {JSON.stringify(
              {
                totalOrders: state.filteredOrders?.length,
                currentFilter: selectedFilter,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
