import React, { useRef, useState } from "react";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "../../api/api";
import "../scrollhide.css";
import CategoriesNav from "../CategoriesNavbar/CategoriesNav";

const TopNewReleasee = () => {
  const scrollRef = useRef(null);

  // default: All Categories
  const [active, setActive] = useState({
    label: "All Categories",
    value: "all",
  });

  const {
    data: gamesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["games", active.value],
    queryFn: async ({ queryKey }) => {
      const [_key, categoryValue] = queryKey;
      if (categoryValue === "all") {
        const response = await apiConfig.get("/steam/games/latest"); // default
        return response.data.data;
      }
      const response = await apiConfig.get(
        `/steam/games/genre/${categoryValue}`
      );
      return response.data;
    },
    enabled: !!active.value,
  });

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (container) {
      const card = container.querySelector("a[data-card]");
      if (card) {
        const scrollAmount = card.offsetWidth + 16;
        container.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        "
      </div>
    );
  }

  if (isError) {
    return (
      <h1 className="font-bold text-2xl text-center text-red-700">
        {error?.message}
      </h1>
    );
  }

  if (!gamesData || gamesData.length === 0) {
    return (
      <h1 className="font-bold text-center text-white text-2xl">
        No games found.
      </h1>
    );
  }

  return (
    <>
      <CategoriesNav active={active} setActive={setActive} />

      <div className="w-full mx-auto ml-2 overflow-x-hidden mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 ml-2">
            {active.label} <span className="text-2xl">›</span>
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
          {gamesData.map((game, idx) => (
            <Link
              key={idx}
              to="/detials"
              state={{ game }}
              data-card
              className="
                relative group rounded-xl 
                w-48 flex-shrink-0 snap-start transition-shadow duration-200 hover:shadow-2xl
                md:w-[19%]
              "
              style={{ minWidth: "192px" }}
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

export default TopNewReleasee;
