import React from "react";
import PropTypes from "prop-types";

export default function OrderStatusTracker({
  currentOrderStatus = "shipped",
  statusDates = {
    confirmed: "8:00 AM, Feb 8, 2024",
    shipped: "10:30 AM, Feb 10, 2024",
    out_for_delivery: "Estimated Feb 15, 2024",
    delivered: "Estimated Feb 16, 2024",
  },
  orderStatuses = [
    {
      step: 1,
      title: "Order Confirmed",
      status: "confirmed",
      icon: () => "✓",
    },
    {
      step: 2,
      title: "Shipped",
      status: "shipped",
      icon: () => "✓",
    },
    {
      step: 3,
      title: "Out for Delivery",
      status: "out_for_delivery",
      icon: () => "✓",
    },
    {
      step: 4,
      title: "Delivered",
      status: "delivered",
      icon: () => "✓",
    },
  ],
}) {
  const getStatusInfo = (item) => {
    const isCompleted = orderStatuses
      .slice(
        0,
        orderStatuses.findIndex((s) => s.status === currentOrderStatus) + 1,
      )
      .some((s) => s.status === item.status);

    const isCurrentStatus = item.status === currentOrderStatus;

    return { isCompleted, isCurrentStatus };
  };

  return (
    <div className="w-full rounded-md border border-gray-200 bg-white px-2 py-10 lg:px-4 lg:py-12">
      {/* Mobile (Vertical Layout) */}
      <div className="w-fill flex flex-col items-center gap-4 md:hidden">
        {orderStatuses.map((item, index) => {
          const { isCompleted, isCurrentStatus } = getStatusInfo(item);

          return (
            <div key={item.step} className="flex w-[50%] items-center">
              <div className="relative mr-4 flex flex-col items-center">
                <div
                  className={`absolute bottom-[-100%] top-0 w-1 ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  } ${index === 0 ? "top-1/2" : ""} ${
                    index === orderStatuses.length - 1 ? "hidden" : ""
                  }`}
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                />
                <div
                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? isCurrentStatus
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-300"
                  }`}
                >
                  <span className="text-[14px] font-medium">{item.icon()}</span>
                </div>
              </div>
              <div className="flex-1">
                <p
                  className={`text-[10px] font-medium tracking-normal ${
                    isCompleted ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
                <p
                  className={`text-[10px] ${
                    isCompleted ? "text-gray-500" : "text-gray-400/80"
                  }`}
                >
                  {
                    statusDates[
                      item.status === "out_for_delivery"
                        ? "out_for_delivery"
                        : item.status
                    ]
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop (Horizontal Layout) */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {orderStatuses.map((item, index) => {
            const { isCompleted, isCurrentStatus } = getStatusInfo(item);

            return (
              <div
                key={item.step}
                className="relative flex flex-1 flex-col items-center"
              >
                {/* Connecting Line (before node) */}
                {index > 0 && (
                  <div
                    className={`absolute left-0 right-[50%] top-[22px] h-1 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Connecting Line (after node) */}
                {index < orderStatuses.length - 1 && (
                  <div
                    className={`absolute left-[50%] right-0 top-[22px] h-1 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`z-10 mb-4 flex h-8 w-8 items-center justify-center rounded-full border-2 md:h-10 md:w-10 lg:h-12 lg:w-12 ${
                    isCompleted
                      ? isCurrentStatus
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-300"
                  }`}
                >
                  <span className="text-[14px] font-medium">{item.icon()}</span>
                </div>

                {/* Status Text */}
                <div className="text-center">
                  <p
                    className={`text-[10px] font-medium tracking-normal md:text-[10px] lg:text-[12px] ${
                      isCompleted ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-[10px] ${
                      isCompleted ? "text-gray-500" : "text-gray-400/80"
                    }`}
                  >
                    {
                      statusDates[
                        item.status === "out_for_delivery"
                          ? "out_for_delivery"
                          : item.status
                      ]
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

OrderStatusTracker.propTypes = {
  currentOrderStatus: PropTypes.oneOf([
    "pending",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ]),
  statusDates: PropTypes.shape({
    confirmed: PropTypes.string,
    shipped: PropTypes.string,
    out_for_delivery: PropTypes.string,
    delivered: PropTypes.string,
  }),
  statusOrder: PropTypes.arrayOf(PropTypes.string),
};
