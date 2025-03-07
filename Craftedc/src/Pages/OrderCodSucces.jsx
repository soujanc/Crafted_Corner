import React, { useEffect, useState, useReducer } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Button from "../components/Buttons/Button";
import {
  orderReducer,
  initialOrderState,
  useOrderActions,
} from "../Reducers/Ordereducers";

export default function OrderCodSucces() {
  const orderId = useParams().orderId;
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState({
    orderId: null,
    name: null,
    email: null,
    date: new Date(),
    shippingAddress: null,
    paymentMethod: "Cash on Delivery",
    items: [],
    totalAmount: 0,
    taxAmount: 0,
    shippingFee: 0,
  });
  const [orderState, orderdispatch] = useReducer(
    orderReducer,
    initialOrderState,
  );
  const { updateOrderPaymentStatus } = useOrderActions(orderdispatch);
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        // Handle case where no order ID is found
        console.error("No order ID found");
        navigate("/"); // Redirect to home or error page
        return;
      }
      try {
        console.log("Order ID:", orderId);
        const orderResponse = await updateOrderPaymentStatus(
          orderId,
          "pending",
        );
        console.log(
          "Order Status Updated this is the returned order:",
          orderResponse,
        );

        if (orderResponse) {
          setOrderDetail((prev) => ({
            ...prev,
            orderId: orderResponse.orderId,
            name: orderResponse.name,
            email: orderResponse.email,
            shippingAddress: {
              name: orderResponse.name,
              street: orderResponse.shippingAddress?.street,
              city: orderResponse.shippingAddress?.city,
              state: orderResponse.shippingAddress?.state,
              zip: orderResponse.shippingAddress?.zipCode,
              country: orderResponse.shippingAddress?.country,
              phone: orderResponse.phone,
            },
            items: orderResponse.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              productId: item.productId,
              color: item.color,
              category: item.category,
            })),
            totalAmount: orderResponse.totalAmount || 0,
            taxAmount: orderResponse.taxAmount || 0,
            shippingFee: orderResponse.shippingFee || 0,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);
  if (orderState.loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white font-inter antialiased">
        <div className="relative w-full max-w-xl rounded-lg p-6 text-center">
          <div className="absolute inset-0 -z-10 animate-pulse bg-green-50 opacity-20 blur-2xl"></div>
          <div className="flex flex-col gap-1">
            <div className="mb-2 flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-bounce rounded-full bg-green-400 shadow-sm [animation-delay:-0.6s]"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-green-400 shadow-sm [animation-delay:-0.4s]"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-green-400 shadow-sm [animation-delay:-0.2s]"></div>
              <div className="h-4 w-4 animate-bounce rounded-full bg-green-400 shadow-sm"></div>
            </div>
            <div className="relative mb-4 h-4 overflow-hidden text-[10px] text-gray-400">
              <div className="absolute w-full animate-[slide_6s_ease-in-out_infinite]">
                <span className="block transform font-light tracking-wide text-gray-500 transition-transform duration-1000 group-hover:-translate-y-full">
                  Securing payment...
                </span>
                <span className="block transform font-light tracking-wide text-gray-500 transition-transform duration-1000 group-hover:-translate-y-full">
                  Verifying transaction details...
                </span>
                <span className="block transform font-light tracking-wide text-gray-500 transition-transform duration-1000 group-hover:-translate-y-full">
                  Connecting with bank...
                </span>
                <span className="block transform font-light tracking-wide text-gray-500 transition-transform duration-1000 group-hover:-translate-y-full">
                  Finalizing order...
                </span>
              </div>
            </div>
            <h2 className="relative text-[18px] font-medium tracking-normal text-gray-700">
              Processing Transaction
            </h2>
            <p className="text-[12px] font-light tracking-normal text-gray-500">
              Please wait while we securely process your order. Do not close or
              refresh the page.
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-2xl px-4 text-center 2xl:px-0">
        <div className="mb-2 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mb-2 h-14 w-14 text-green-500"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-[20px] font-medium text-green-600">
            Order Successful
          </h2>
        </div>

        <h2 className="mb-2 text-[12px] font-medium text-gray-600 md:text-[14px]">
          Thanks for your order!
        </h2>
        <p className="mb-6 text-[12px] font-normal text-gray-500 dark:text-gray-400 md:mb-8">
          Your order{" "}
          <a href="#" className="text-gray-900 hover:underline dark:text-white">
            #{orderDetail.orderId}
          </a>{" "}
          will be processed within 24 hours during working days. We will notify
          you by email once your order has been shipped.
        </p>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-sm tracking-wide dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-left text-[14px] font-normal text-[#4D4D4D]">
              Order Details
            </h3>
            <div className="h-[1px] w-full bg-gray-200"></div>
            {[
              ["Name", orderDetail.shippingAddress?.name || "N/A"],
              ["Contact", orderDetail.shippingAddress?.phone || "N/A"],
              [
                "Date",
                orderDetail.date
                  ? orderDetail.date.toLocaleDateString()
                  : "N/A",
              ],
              ["Payment", orderDetail.paymentMethod || "N/A"],
              [
                "Shipping",
                orderDetail.shippingAddress
                  ? `${orderDetail.shippingAddress.street || "N/A"}, ${orderDetail.shippingAddress.city || "N/A"}, ${orderDetail.shippingAddress.state || "N/A"}`
                  : "N/A",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between border-gray-200 py-1 text-[12px]"
              >
                <span className="text-[12px] font-normal text-gray-600">
                  {label}
                </span>
                <span className="text-[12px] font-medium text-gray-700 dark:text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-6 tracking-wide">
          <div className="flex flex-col gap-2 md:gap-3">
            <h3 className="text-left text-[14px] font-normal text-[#4D4D4D]">
              Ordered Items
            </h3>
            <div className="w-full border-t bg-gray-200"></div>
            {orderDetail.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-gray-200 py-1 text-[12px]"
              >
                <div
                  key={index}
                  className="flex flex-col items-start justify-start tracking-wide"
                >
                  <span className="text-[12px] font-normal text-gray-600">
                    {item.name}
                  </span>
                  <span className="text-[12px] font-light text-gray-500 dark:text-white">
                    quantity : {item.quantity}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-gray-600 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-gray-200 py-1 text-[12px]">
              <span className="text-[12px] font-normal text-gray-600">Tax</span>
              <span className="text-[12px] font-medium text-gray-600 dark:text-white">
                ${orderDetail.taxAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between border-gray-200 py-1 text-[12px]">
              <span className="text-[12px] font-normal text-gray-600">
                Shipping Fee
              </span>
              <span className="text-[12px] font-medium text-gray-600 dark:text-white">
                ${orderDetail.shippingFee?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="w-full border-t border-gray-200 bg-gray-200"></div>
            <div className="flex justify-between py-1 text-[12px]">
              <span className="text-[12px] font-medium text-gray-700">
                Total Amount Paid
              </span>
              <span className="text-[12px] font-medium text-gray-700 dark:text-white">
                ${orderDetail.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            text="Track your order"
            variant="filledBlack"
            onClick={() => navigate("/track-order")}
            size="compact"
          />
          <Button
            text="Return to shopping"
            variant="outlinedBlack"
            onClick={() => navigate("/")}
            size="compact"
          />
        </div>
      </div>
    </section>
  );
}
