import React, { useRef } from "react";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../scrollhide.css'; 

const CardSlide = ({ games, heading, arrow }) => {
  const scrollRef = useRef(null);

  // Scroll left/right by one card
  const scroll = (dir) => {
    const container = scrollRef.current;
    if (container) {
      const card = container.querySelector("div[data-card]");
      if (card) {
        const scrollAmount = card.offsetWidth + 16;
        container.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full mx-auto ml-2 overflow-x-hidden mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3 ml-2">
          {heading} <span className="text-2xl">{arrow}</span>
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
        {games.map((game, idx) => (
          <Link
            key={idx}
            to="/detials"
            state={{ game }} // Pass the whole game object as state
            className="
              relative group rounded-xl 
              w-48 flex-shrink-0 snap-start transition-shadow duration-200 hover:shadow-2xl
              md:w-[19%]
            "
            style={{ minWidth: "180px", maxWidth: "150px" }}
          >
            <button
              className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1.5"
              title="Add to wishlist"
              onClick={e => e.preventDefault()} // Prevents navigation when clicking the plus
            >
              <FaPlus className="text-white text-lg" />
            </button>
            <div
              className="h-65 w-full rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: `url(${game.image})`,
              }}
            />
            <div className="py-3">
              <div className="text-xs text-zinc-400">{game.type}</div>
              <div className="font-bold text-white text-base leading-tight mb-1">
                {game.title}
              </div>
              {game.subtitle && (
                <div className="text-xs text-zinc-300 mb-1">{game.subtitle}</div>
              )}
              <div className="flex items-center gap-2">
                {game.discount && (
                  <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full font-bold">
                    {game.discount}
                  </span>
                )}
                {game.oldPrice && (
                  <span className="text-zinc-400 text-sm line-through">{game.oldPrice}</span>
                )}
                {game.price && (
                  <span className="text-white text-sm font-semibold">{game.price}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CardSlide;