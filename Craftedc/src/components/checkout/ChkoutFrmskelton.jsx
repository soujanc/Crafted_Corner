import React from "react";

export default function ChkoutFrmskelton() {
  return (
    <div className="md:w-[65%] lg:w-[70%]">
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-10 rounded bg-gray-200"></div>
              <div className="col-span-1 h-10 rounded bg-gray-200"></div>
            </div>
            <div className="h-10 rounded bg-gray-200"></div>
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
