// src/components/SectionColumn/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function FreeGamesSection2({ sections }) {
  const navigate = useNavigate();

  const handleGameClick = (item) => {
    navigate("/detials", { state: { game: item } });
  };

  return (
    <div className="space-y-10">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-bold mb-4 text-white">
            {section.title}
          </h2>
          {section.isLoading && <p>Loading...</p>}
          {section.isError && (
            <p className="text-red-500">Error loading data.</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {section.items && section.items.length > 0
              ? section.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleGameClick(item)}
                    className="cursor-pointer py-4 overflow-hidden rounded-lg hover:bg-gray-800 transition"
                  >
                    <img
                      src={item.header_image}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <div className="font-semibold text-white">{item.name}</div>
                    {item.price && (
                      <div className="text-green-400">{item?.option_text}</div>
                    )}
                    {item.discount && (
                      <div className="text-red-400">{item.discount}</div>
                    )}
                    {item.oldPrice && (
                      <div className="line-through text-gray-400">
                        {item.oldPrice}
                      </div>
                    )}
                    {item.date && (
                      <div className="text-sm text-gray-400">{item.date}</div>
                    )}
                    {item.tag && (
                      <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {item.tag}
                      </div>
                    )}
                  </div>
                ))
              : !section.isLoading && (
                  <div className="col-span-full text-gray-400">
                    No items found.
                  </div>
                )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FreeGamesSection2;
