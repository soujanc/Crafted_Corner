import React from "react";
import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducer } from "react";

import Button from "../components/Buttons/Button";
import {
  orderReducer,
  initialOrderState,
  useOrderActions,
} from "../Reducers/Ordereducers";

export default function OrdrSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const [orderState, orderdispatch] = useReducer(
    orderReducer,
    initialOrderState,
  );

  const { updateOrderPaymentStatus } = useOrderActions(orderdispatch);
  const stripe = useStripe();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [intentId, setIntentId] = useState(null);
  const [transactionFailed, setTransactionFailed] = useState(true);
  // New state with specific order details
  const [orderDetail, setOrderDetail] = useState({
    orderId: null,
    name: null,
    email: null,
    date: null,
    shippingAddress: null,
    paymentMethod: null,
    items: [],
    totalAmount: 0,
    taxAmount: 0,
    shippingFee: 0,
  });
  // Add a loading state to track order detail update

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      setStatus("error");
      return;
    }

    // Retrieve payment status from Stripe
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        setStatus("error");
        return;
      }
      console.log("Payment Intent:", paymentIntent);
      setIntentId(paymentIntent.id);

      if (paymentIntent.status === "succeeded") {
        setStatus("success");
      } else if (paymentIntent.status === "requires_payment_method") {
        setStatus("failed");
      } else if (paymentIntent.status === "default") {
        setStatus("default");
      }
      setOrderDetail((prev) => ({
        ...prev,
        totalAmount: paymentIntent.amount / 100, // Convert cents to dollars
        paymentMethod: paymentIntent.payment_method_types[0],
        date: new Date(),
      }));
    });
  }, [stripe]);

  useEffect(() => {
    const updateStatus = async () => {
      if (orderId) {
        try {
          // Map component status to payment status
          let paymentStatus;
          switch (status) {
            case "success":
              paymentStatus = "paid";
              break;
            case "failed":
              paymentStatus = "failed";
              break;
            case "default":
              paymentStatus = "failed";
              break;
            default:
              paymentStatus = "failed";
          }

          // Update order payment status
          const orderResponse = await updateOrderPaymentStatus(
            orderId,
            paymentStatus,
          );
          console.log(
            "Order Status Updated this is the returned order:",
            orderResponse,
          );
          if (orderResponse) {
            setOrderDetail((prev) => ({
              // Preserve existing values from payment intent
              ...prev,
              // Override with backend response
              orderId: orderResponse.orderId,
              name: orderResponse.name,
              email: orderResponse.email,
              shippingAddress: {
                name: orderResponse.name,
                street:
                  orderResponse.shippingAddress?.street ||
                  prev.shippingAddress?.street,
                city:
                  orderResponse.shippingAddress?.city ||
                  prev.shippingAddress?.city,
                state:
                  orderResponse.shippingAddress?.state ||
                  prev.shippingAddress?.state,
                zip:
                  orderResponse.shippingAddress?.zipCode ||
                  prev.shippingAddress?.zip,
                country:
                  orderResponse.shippingAddress?.country ||
                  prev.shippingAddress?.country,
                phone: orderResponse.phone || prev.shippingAddress?.phone,
              },
              // Preserve payment method from Stripe if possible
              paymentMethod: prev.paymentMethod || "Card",
              items: orderResponse.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                productId: item.productId,
                color: item.color,
                category: item.category,
              })),
              // Use backend values for amounts if available

              taxAmount: orderResponse.taxAmount || prev.taxAmount || 0,
              shippingFee: orderResponse.shippingFee || prev.shippingFee || 0,
            }));
          }
        } catch (error) {
          console.error(`Failed to update order status to ${status}:`, error);
        }
      }
    };

    // Only run update if status is not 'pending'
    if (status !== "pending") {
      updateStatus();
    }
  }, [status, orderId]);

  if (status === "loading") {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white font-inter antialiased">
        <div className="relative w-full max-w-xl rounded-lg p-6 text-center">
          <div className="absolute inset-0 -z-10 animate-pulse bg-green-50 opacity-20 blur-2xl"></div>
          <div className="flex flex-col gap-1">
            <div className="mb-2items-center flex justify-center space-x-2">
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

  if (status === "requires") {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white font-inter antialiased">
        <div className="relative w-full max-w-xl rounded-lg p-6 text-center">
          <div className="absolute inset-0 -z-10 bg-red-50 opacity-20 blur-2xl"></div>
          <div className="flex flex-col items-center gap-4">
            <svg
              width="28px"
              height="28px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              className="text-gray-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M8.5 14C8.22386 14 8 13.7761 8 13.5C8 13.2239 8.22386 13 8.5 13C8.77614 13 9 13.2239 9 13.5C9 13.7761 8.77614 14 8.5 14Z"
                fill="#000000"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M15.5 14C15.2239 14 15 13.7761 15 13.5C15 13.2239 15.2239 13 15.5 13C15.7761 13 16 13.2239 16 13.5C16 13.7761 15.7761 14 15.5 14Z"
                fill="#000000"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M10 18H14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <div className="space-y-2">
              <h2 className="text-[18px] font-medium tracking-normal text-red-400">
                Transaction Failed !
              </h2>
              <p className="text-[12px] font-light tracking-wide text-gray-500">
                We couldn't complete your transaction. Please check your payment
                method or try again later.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setTransactionFailed(false);
                }}
                size="small"
                text="Try Again"
                variant="outlinedBlack"
                className="text-[10px] font-medium tracking-wide text-gray-600"
              ></Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (status === "default") {
    return (
      <section className="flex min-h-screen items-center justify-center bg-white font-inter antialiased">
        <div className="relative w-full max-w-xl rounded-lg p-6 text-center">
          <div className="absolute inset-0 -z-10 bg-red-50 opacity-20 blur-2xl"></div>
          <div className="flex flex-col items-center gap-4">
            <svg
              width="28px"
              height="28px"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              className="text-gray-500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                d="M8.5 14C8.22386 14 8 13.7761 8 13.5C8 13.2239 8.22386 13 8.5 13C8.77614 13 9 13.2239 9 13.5C9 13.7761 8.77614 14 8.5 14Z"
                fill="#000000"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M15.5 14C15.2239 14 15 13.7761 15 13.5C15 13.2239 15.2239 13 15.5 13C15.7761 13 16 13.2239 16 13.5C16 13.7761 15.7761 14 15.5 14Z"
                fill="#000000"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M10 18H14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <div className="space-y-2">
              <h2 className="text-[18px] font-medium tracking-normal text-red-400">
                Transaction Failed !
              </h2>
              <p className="text-[12px] font-light tracking-wide text-gray-500">
                Something went wrong. Please check your payment details and
                retry.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setTransactionFailed(false);
                }}
                size="small"
                text="Try Again"
                variant="outlinedBlack"
                className="text-[10px] font-medium tracking-wide text-gray-600"
              ></Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // Skeleton Loader Component

  if (status === "success")
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
            <a
              href="#"
              className="text-gray-900 hover:underline dark:text-white"
            >
              #{orderDetail.orderId}
            </a>{" "}
            will be processed within 24 hours during working days. We will
            notify you by email once your order has been shipped.
          </p>

          <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-sm tracking-wide dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col gap-2 md:gap-3">
              <h3 className="text-left text-[14px] font-normal text-[#4D4D4D]">
                Order Details
              </h3>
              <div className="h-[1px] w-full bg-gray-200"></div>
              {/* using sub array apprproach to make it easier to add more content in future  the data are nitpicked and arranged into a sub array with keys and values */}
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
              {/* Add tax row */}
              <div className="flex justify-between border-gray-200 py-1 text-[12px]">
                <span className="text-[12px] font-normal text-gray-600">
                  Tax
                </span>
                <span className="text-[12px] font-medium text-gray-600 dark:text-white">
                  ${orderDetail.taxAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
              {/* Add shipping fee row */}
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
          {/* {intentId && (
            <a
              href={`https://dashboard.stripe.com/payments/${intentId}`}
              id="view-details"
              rel="noopener noreferrer"
              target="_blank"
              className="mt-4 flex items-center justify-start gap-2 text-[12px] font-medium text-gray-600 hover:text-blue-600 "
            >
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-[14px] w-[15px] "
                style={{ paddingLeft: "5px" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.125 3.49998C2.64175 3.49998 2.25 3.89173 2.25 4.37498V11.375C2.25 11.8582 2.64175 12.25 3.125 12.25H10.125C10.6082 12.25 11 11.8582 11 11.375V9.62498C11 9.14173 11.3918 8.74998 11.875 8.74998C12.3582 8.74998 12.75 9.14173 12.75 9.62498V11.375C12.75 12.8247 11.5747 14 10.125 14H3.125C1.67525 14 0.5 12.8247 0.5 11.375V4.37498C0.5 2.92524 1.67525 1.74998 3.125 1.74998H4.875C5.35825 1.74998 5.75 2.14173 5.75 2.62498C5.75 3.10823 5.35825 3.49998 4.875 3.49998H3.125Z"
                  fill="currentColor"
                />
                <path
                  d="M8.66672 0C8.18347 0 7.79172 0.391751 7.79172 0.875C7.79172 1.35825 8.18347 1.75 8.66672 1.75H11.5126L4.83967 8.42295C4.49796 8.76466 4.49796 9.31868 4.83967 9.66039C5.18138 10.0021 5.7354 10.0021 6.07711 9.66039L12.7501 2.98744V5.83333C12.7501 6.31658 13.1418 6.70833 13.6251 6.70833C14.1083 6.70833 14.5001 6.31658 14.5001 5.83333V0.875C14.5001 0.391751 14.1083 0 13.6251 0H8.66672Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          )}//for dev purpose to check dashboard */}

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
