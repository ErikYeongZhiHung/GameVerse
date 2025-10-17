import React from "react";

const priceFilters = ["All", "Under $5", "Free"];

export default function FilterBar({ priceFilter, setPriceFilter }) {
  return (
    <div className="flex flex-wrap gap-3 p-4 justify-center md:justify-start">
      {priceFilters.map((label) => (
        <button
          key={label}
          onClick={() => setPriceFilter(label)}
          className={`px-3 py-1 text-sm rounded-full ${
            priceFilter === label ? "bg-green-500 text-white" : "bg-zinc-700 text-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
