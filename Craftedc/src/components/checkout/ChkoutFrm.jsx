import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

/**
 * Checkout Form Component for handling payment and order placement
 * @returns {React.ReactElement} Rendered checkout form with accordion and payment integration
 */
export default function ChkoutFrm({ orderId }) {
  // State for accordion open/close
  const stripe = useStripe();
  const navigate = useNavigate();
  const elements = useElements();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleAccordion = () => {
    //to toggle the accordion
    setIsOpen(!isOpen);
  };
  const handlePlaceCodOrder = () => {
    navigate(`/ordercodsuccess/${orderId}`);
  };
  /**
   * Handles the form submission for payment processing using Stripe.
   *
   * This asynchronous function manages the payment confirmation process:
   * - Prevents default form submission behavior
   * - Checks for Stripe and Elements availability
   * - Initiates payment confirmation
   * - Handles different types of errors
   * - Manages loading state during the process
   *
   * @async
   * @function handleSubmit
   * @param {Event} e - The form submission event
   *
   * @throws {Error} Handles Stripe-related errors such as card errors or validation errors
   *
   * @description
   * - Sets loading state to true before payment confirmation
   * - Uses Stripe's confirmPayment method to process the payment
   * - Redirects to success page on successful payment
   * - Sets error messages for different types of payment failures
   * - Ensures loading state is reset after payment attempt
   *
   * @example
   * // Typical usage in a form with Stripe Elements
   * <form onSubmit={handleSubmit}>
   *   <button type="submit">Pay Now</button>
   * </form>
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/success?orderId=${orderId}`,
      },
    });
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };
  /**
   * Manages the automatic clearing of error or status messages.
   *
   * This useEffect hook automatically clears the message state after a specified duration:
   * - Sets a timeout to clear the message after 5 seconds when a message exists
   * - Provides a cleanup function to prevent memory leaks by clearing the timeout
   *
   * @function
   * @name messageClearEffect
   *
   * @description
   * - Monitors changes to the `message` state
   * - Automatically removes messages after a short delay
   * - Ensures proper resource management by clearing timeouts
   *
   * @see React.useEffect
   * @see setTimeout
   * @see clearTimeout
   *
   * @example
   * // Automatically clears error messages after 5 seconds
   * useEffect(() => {
   *   let timeoutId = setTimeout(() => setMessage(""), 5000);
   *   return () => clearTimeout(timeoutId);
   * }, [message]);
   */
  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        setMessage("");
      }, 5000); // Clear message after 5 seconds
    }
    // Cleanup function to clear timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]);

  return (
    <div className="md:w-[65%] lg:w-[70%]">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white">
        <div
          className="flex cursor-pointer items-center justify-between p-6 transition-all duration-300 ease-in-out"
          onClick={toggleAccordion}
        >
          <h3 className="text-sm font-medium text-gray-700">
            Cash On Delivery
          </h3>

          <svg
            width="18px"
            height="18px"
            className={`text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>

        {/* Accordion Content */}
        <div
          className={`grid overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[200px] pb-6 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6">
            <p className="text-[10px] font-light leading-none tracking-wide text-gray-500 md:text-[12px]">
              Pay when you receive your package. A hassle-free and secure way to
              shop.
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                text="Place Order"
                size="compact"
                variant="filledBlackNoHover"
                onClick={handlePlaceCodOrder}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          Pay with Card
        </h3>
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement
            id="payment-element"
            options={{ layout: "accordion" }}
          />
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            className="mt-4 w-full rounded-full bg-deepgray px-4 py-2 text-[12px] text-white disabled:opacity-50"
          >
            {isLoading ? <div className="spinner"></div> : "Pay Now"}
          </button>
          {message && (
            <div
              className="mt-4 flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-[12px] tracking-normal text-red-400">
                  {message}
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
