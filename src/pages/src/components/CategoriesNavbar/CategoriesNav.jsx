import React from "react";

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Racing", value: "racing" },
  { label: "RPG", value: "rpg" },
  { label: "Simulation", value: "simulation" },
  { label: "Sports", value: "sports" },
  { label: "Strategy", value: "strategy" },
  { label: "Indie", value: "indie" },
];

export default function CategoriesNav({ active, setActive }) {
  return (
    <nav className="flex flex-wrap gap-4 justify-center md:justify-start p-4 bg-zinc-900 text-white rounded-lg">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setActive(cat)}
          className={`px-4 py-2 rounded-lg transition ${
            active.value === cat.value
              ? "bg-blue-600"
              : "bg-zinc-800 hover:bg-blue-800"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
