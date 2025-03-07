import React from "react";
import { useNavigate } from "react-router-dom";

export default function BreadCrumb({ items }) {
  const navigate = useNavigate();
  return (
    // Navigation container with responsive bottom margin
    <nav className="flex  mt-4 mb-8 lg:mt-10 lg:mb-10">
      {/* Ordered list for breadcrumb items with styling */}
      <ol className="flex items-center space-x-2 text-[10px] lg:text-[11px]  font-inter tracking-wider text-gray-500">
        {/* Map through each breadcrumb item */}
        {items.map((item, index) => (
          // Fragment to avoid extra DOM nodes, with unique key for each item
          <React.Fragment key={index}>
            {/* Add separator (>) between items, but not before first item */}
            {index > 0 && (
              <li>
                <span className="text-gray-400">&gt;</span>
              </li>
            )}
            <li>
              {/* If item has a link, render as clickable button, otherwise as plain text */}
              {item.link ? (
                <button
                  onClick={() => navigate(item.link)}
                  className="hover:text-gray-700"
                >
                  {item.label}
                </button>
              ) : (
                // Current/last item is darker and non-clickable
                <span className="text-deepgray ">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
