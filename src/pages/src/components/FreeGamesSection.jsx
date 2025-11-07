import React from "react";
import { FaGift } from "react-icons/fa";

const games = [
  {
    title: "Legion TD 2",
    image: "https://cdn1.epicgames.com/spt-assets/29586d03c1c147569a1991a8616c1413/legion-td-2-1em1j.png?resize=1&w=854&h=480&quality=medium",
    status: "FREE NOW",
    date: "Free Now - Jul 31 at 08:00 PM",
    link: "#",
  },
  {
    title: "Keylocker | Turn Based Cyberpunk Action",
    image: "https://cdn1.epicgames.com/spt-assets/186103570e674b0f9b60a1003ec09d07/keylocker-cr3ty.png?resize=1&w=854&h=480&quality=medium",
    status: "COMING SOON",
    date: "Free Jul 31 - Aug 07",
    link: "#",
  },
  {
    title: "Pilgrims",
    image: "https://cdn1.epicgames.com/spt-assets/bfb773acd06f4d4090b82bd18f4b7744/pilgrims-jgz8i.png?resize=1&w=854&h=480&quality=medium",
    status: "COMING SOON",
    date: "Free Jul 31 - Aug 07",
    link: "#",
  },
];

export default function FreeGamesSection() {
  return (
    <div className="bg-[#18171c] rounded-2xl p-6  ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaGift className="text-2xl text-white" />
          <h2 className="text-white text-xl font-bold">Free Games</h2>
        </div>
        <button className="bg-[#232228] text-white px-5  py-2 rounded-lg text-sm font-medium hover:bg-[#2c2b31] transition">
          View More
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game, idx) => (
          <div key={idx} className="bg-transparent">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-42 object-cover"
              />
              <div
                className={`absolute bottom-0 left-0 w-full text-center text-xs font-bold py-2 ${
                  game.status === "FREE NOW"
                    ? "bg-[#1eaaf1] text-black"
                    : "bg-black text-white"
                }`}
              >
                {game.status}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-white font-bold text-base leading-tight">
                {game.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{game.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}