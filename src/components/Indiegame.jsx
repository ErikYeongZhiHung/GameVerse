import React, { useRef } from "react";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "../api/api";
import "../components/scrollhide.css";

const Indiegame = () => {
  const scrollRef = useRef(null);

  // Fetch games data using React Query
  const {
    data: IndeigamesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["indiegames"],
    queryFn: async () => {
      try {
        const response = await apiConfig.get("/steam/games/genre/Indie");
        // Log the full response for debugging
        console.log("Full Indie API response:", response);
        // Try different possible data paths
        if (Array.isArray(response.data?.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        } else {
          return [];
        }
      } catch (err) {
        console.error("Failed to fetch Indie games:", err);
        return [];
      }
    },
  });

  console.log("IndeigamesData", IndeigamesData);

  // Scroll left/right by one card
  const scroll = (dir) => {
    const container = scrollRef.current;
    if (container) {
      const card = container.querySelector("a[data-card]");
      if (card) {
        const scrollAmount = card.offsetWidth + 16; // 16px gap-4
        container.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <h1 className="font-bold text-center text-white text-3xl">Loading...</h1>
    );
  }

  // Error state
  if (isError) {
    return (
      <h1 className="font-bold text-2xl text-center text-red-700">
        {error?.message}
      </h1>
    );
  }

  // No data state
  if (!Array.isArray(IndeigamesData) || IndeigamesData.length === 0) {
    return (
      <div>
        <h1 className="font-bold text-center text-white text-2xl">
          No Indie games found.
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Try again later or check the API endpoint.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto ml-2 overflow-x-hidden mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 ml-2">
            Indie Games <span className="text-2xl">›</span>
          </h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="p-2 rounded-full bg-[#232329] hover:bg-[#2c2c32] text-white"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll(1)}
              className="p-2 rounded-full bg-[#232329] hover:bg-[#2c2c32] text-white"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {IndeigamesData.map((game, idx) => (
            <Link
              key={idx}
              to="/detials"
              state={{ game }}
              data-card // <-- This enables scroll buttons to work!
              className="
                relative group rounded-xl 
                w-48 flex-shrink-0 snap-start transition-shadow duration-200 hover:shadow-2xl
                md:w-[19%]
              "
              style={{ minWidth: "192px" }} // match w-48 (12rem)
            >
              <button
                className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1.5"
                title="Add to wishlist"
                onClick={(e) => e.preventDefault()}
              >
                <FaPlus className="text-white text-lg" />
              </button>
              <div
                className="h-65 w-full rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${game.header_image})`,
                  minHeight: "260px",
                }}
              />
              <div className="py-3">
                <div className="text-xs text-zinc-400">{game.type}</div>
                <div className="font-bold text-white text-base leading-tight mb-1">
                  {game.name}
                </div>
                <div className="flex items-center gap-2">
                  {game?.price_overview?.initial && (
                    <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium line-through mr-2">
                      RM {game.price_overview.initial / 100}
                    </span>
                  )}
               <span className="text-white text-sm font-semibold">
                    {game?.price_overview?.final_formatted ?
                      game.price_overview.final_formatted.replace("$", "RM ").replace("USD", "") : "Free"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Indiegame;
