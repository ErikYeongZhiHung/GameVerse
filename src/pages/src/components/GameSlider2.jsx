import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const games = [
  {
    title: "Cyberpunk 2077",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
    description: "Update 2.3 is available now alongside Ultimate Edition’s launch on Apple silicon Mac models, 16GB+!",
    discount: "-60%",
    oldPrice: "$59.99",
    price: "$23.99",
  },
  {
    title: "Bullet Yeeters",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/2828720/header.jpg",
    description: "Claim your free reward and gain early access to Bullet Yeeters. Pure jetpack-fueled mayhem awaits!",
    button: "Play Now",
  },
];

export default function GameSlider() {
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.offsetWidth * 0.6666;
      const scrollLeft = container.scrollLeft;
      const idx = Math.round(scrollLeft / cardWidth);
      setCurrent(idx);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <div className="w-full mt-10">
      {/* Mobile Scrollable Slider */}
      {isMobile ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {games.map((game, idx) => (
              <div
                key={idx}
                className="group rounded-2xl shadow-md flex-shrink-0 snap-center mx-2 flex flex-col bg-[#232228] transition hover:shadow-xl"
                style={{ minWidth: "66.66vw", maxWidth: "300px" }}
              >
                <div className="relative flex justify-center items-center">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-3 right-3 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add to wishlist"
                  >
                    <FaPlus className="text-white text-lg" />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white">{game.title}</h3>
                  <p className="text-sm text-zinc-300 mb-4">{game.description}</p>
                  {game.discount && (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full font-bold">
                        {game.discount}
                      </span>
                      <span className="text-zinc-400 text-sm line-through">
                        {game.oldPrice}
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {game.price}
                      </span>
                    </div>
                  )}
                  {game.button && (
                    <button className="mt-2 bg-[#1eaaf1] text-black px-4 py-2 rounded font-semibold hover:bg-white transition">
                      {game.button}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {games.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full ${current === idx ? "bg-white" : "bg-zinc-600"} transition`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Desktop view
        <div className="flex gap-6">
          {games.map((game, idx) => (
            <div
              key={idx}
              className={`group relative rounded-xl overflow-hidden flex-1 transition`}
            >
              <span className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition bg-black/60 rounded-full p-2">
                <FaPlus className="text-white text-base" />
              </span>
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-white font-bold text-xl mb-1">{game.title}</h2>
                <p className="text-gray-300 text-sm mb-3">{game.description}</p>
                {game.discount && (
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1eaaf1] text-black text-xs font-bold px-2 py-0.5 rounded">
                      {game.discount}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      {game.oldPrice}
                    </span>
                    <span className="text-white text-sm font-semibold">
                      {game.price}
                    </span>
                  </div>
                )}
                {game.button && (
                  <button className="mt-2 bg-[#232228] text-white px-4 py-2 rounded font-semibold hover:bg-[#1eaaf1] hover:text-black transition">
                    {game.button}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
