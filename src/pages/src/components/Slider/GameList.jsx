import React from "react";

const GameList = ({ games, activeIndex, setActiveIndex, progress }) => {
  return (
    <div className="flex flex-col gap-x-2 gap-y-4 w-45 py-4 pr-2">
      {games.map((game, idx) => {
        const isActive = activeIndex === idx;
        return (
          <div
            key={idx}
            className={`relative flex items-center gap-3 px-2 py-4 rounded-lg cursor-pointer transition-all duration-200  
              ${isActive ? "bg-zinc-800" : "hover:bg-zinc-900"}
            `}
            onClick={() => setActiveIndex(idx)}
            style={{ minHeight: 44 }}
          >
            {/* Progress background fill */}
            {isActive && (
              <div
                className="absolute left-0 top-0 h-full bg-white/10 transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  zIndex: 1,
                }}
              />
            )}
            <img
              src={game.header_image}
              alt={game.name}
              className="w-8 h-10 rounded-md object-cover relative z-10"
            />
            <div className="flex-1 relative z-10">
              <div className="text-sm font-semibold ">{game.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameList;