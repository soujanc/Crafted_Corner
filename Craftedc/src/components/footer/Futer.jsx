import React from "react";
import SectionSubText from "../Typography/SectionSubText";

export default function Futer() {
  return (
    <footer className="overflow-hidden border-t border-gray-100 bg-gray-50 px-[20px] py-12 lg:py-28 lg:pb-0 font-poppins sm:px-[40px] lg:px-[150px]">
      <div className="mx-auto mb-28 flex w-full flex-col justify-between gap-8 md:flex-row">
        {/* Company Info */}
        <div className="flex flex-col">
          <h2
            href="#"
            className="mb-4 w-fit cursor-pointer font-poppins text-[16px] font-bold leading-none tracking-[0.25px] text-gray-500 transition-all duration-300 hover:text-gray-700"
          >
            Crafted Corner
          </h2>
          <SectionSubText text="Timeless furniture for the modern home" />{" "}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col justify-between gap-8 md:flex-row lg:gap-16">
          <div className="min-w-[100px]flex-col flex-1">
            <ul className="space-y-2 text-[10px] font-normal tracking-wide text-gray-500 lg:text-[11px]">
              <li>
                <a href="/shop" className="hover:text-gray-700">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-700">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gray-700">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-gray-700">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="min-w-[100px] flex-1 flex-col">
            <ul className="space-y-2 text-[10px] font-normal tracking-wide text-gray-500 lg:text-[11px]">
              <li>
                <a href="/shipping" className="hover:text-gray-700">
                  Shipping
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-gray-700">
                  Returns
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-gray-700">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-gray-700">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="min-w-[120px] flex-1 flex-col">
            <div className="flex flex-col space-y-2">
              <div>
                <ul className="space-y-2 text-[10px] font-normal tracking-wide text-gray-500 lg:text-[11px]">
                  <li className="text-[10px] font-normal text-gray-500 lg:text-[11px]">
                    support@crafted.com
                  </li>
                  <li className="text-[10px] font-normal text-gray-500 lg:text-[11px]">
                    +1 (555) 123-4567
                  </li>
                </ul>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.058 1.281-.072 1.689-.072 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="-mx-40 mb-6 mt-auto border-t border-gray-200 px-40 pt-6 text-center font-poppins text-[10px] font-light tracking-wide text-gray-500 lg:text-[11px]">
        © {new Date().getFullYear()} CraftEd. All Rights Reserved.
      </div>
    </footer>
  );
}
