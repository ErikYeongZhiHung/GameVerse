import React, { useState, useRef, useEffect, useReducer } from "react";
import GameList from "./GameList";
import StoreNav from "../StoreNav ";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AUTO_SLIDE_INTERVAL = 4000;

const GameSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showBuyNowTooltip, setShowBuyNowTooltip] = useState(false);
  const [showWishlistTooltip, setShowWishlistTooltip] = useState(false);
  const timerRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch games from API
  const {
    data: gamesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await apiConfig.get("/steam/games/limited");
      return response.data.data;
    },
  });

  // Limit to 5 games everywhere
  const slicedGames = gamesData ? gamesData.slice(0, 5) : [];
  const currentGame = slicedGames[activeIndex] || {};

  // For mobile/tablet horizontal scroll
  const scrollRef = useRef();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // Only for desktop/tablet: auto-advance
  useEffect(() => {
    if (!slicedGames.length) return;
    if (window.innerWidth < 768) return; // skip on mobile/tablet

    setProgress(0); // Reset progress on slide change

    // Clear any previous interval
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          setActiveIndex((prevIndex) => (prevIndex + 1) % slicedGames.length);
          return 0;
        }
        return prev + 2.5; // 2.5 * 40 = 100 in 4s
      });
    }, AUTO_SLIDE_INTERVAL / 40);

    return () => clearInterval(timerRef.current);
  }, [activeIndex, slicedGames.length]);

  // For mobile/tablet: get current index based on scroll
  const getCurrentIndex = () => {
    if (!scrollRef.current) return 0;
    const card = scrollRef.current.querySelector("[data-card]");
    if (!card) return 0;
    const cardWidth = card.offsetWidth + 16; // 16px = gap-4
    const scrollLeft = scrollRef.current.scrollLeft;
    return Math.round(scrollLeft / cardWidth);
  };

  // For mobile/tablet: scroll to a slide when a dot is clicked
  const scrollToSlide = (idx) => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16;
      scrollRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: "smooth",
      });
    }
  };

  // For mobile/tablet: update dots on scroll
  const handleScroll = () => {
    forceUpdate();
  };

  // Loading and error states
  if (isLoading) {
    return (
      <h1 className="font-bold text-center text-white text-3xl">Loading...</h1>
    );
  }

  if (isError) {
    return (
      <h1 className="font-bold text-2xl text-center text-red-700">
        {error?.message}
      </h1>
    );
  }

  // If no games data, show nothing
  if (!slicedGames.length) {
    return (
      <h1 className="font-bold text-center text-white text-2xl">
        No games found.
      </h1>
    );
  }

  return (
    <>
      <div className="absolute left-4 top-20 md:absolute md:left-44 md:top-20 md:z-[20]">
        <StoreNav />
      </div>
      <div className="mt-15 text-white flex items-center justify-center px-4 py-8">
        {/* Desktop & Tablet Layout (row) */}
        <div className="hidden md:flex flex-row w-full max-w-[970px] rounded-2xl gap-4 bg-transparent">
          {/* Left: Main Slide */}
          <div className="relative flex-1 flex flex-col justify-end rounded-2xl h-[450px] min-w-[480px] max-w-full overflow-hidden">
            {/* Background image */}
            <img
              src={currentGame.header_image}
              alt={currentGame.name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 to-black/60 z-10" />
            <div className="relative z-20 p-6 space-y-3 flex flex-col justify-end h-full">
              <h2 className="uppercase text-xs font-bold text-white tracking-wide mb-1">
                {currentGame.smallTitle}
              </h2>
              <h1 className="text-2xl font-bold mb-2">{currentGame.name}</h1>
              <p className="max-w-xl text-xs text-white font-medium whitespace-pre-line mb-3">
                {currentGame.short_description}
              </p>
              <div className="font-bold text-base mb-3">
                {currentGame.price}
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <button 
                    className="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 shadow transition"
                    onClick={() => {
                      if (!user) {
                        navigate("/signin");
                        return;
                      }
                      navigate("/detials", { state: { game: currentGame } });
                    }}
                    onMouseEnter={() => {
                      if (!user) setShowBuyNowTooltip(true);
                    }}
                    onMouseLeave={() => setShowBuyNowTooltip(false)}
                  >
                    Buy Now
                  </button>
                  
                  {!user && showBuyNowTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
                      Click to login and buy games
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    className="border border-white text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-white hover:text-black transition shadow"
                    onClick={() => {
                      if (!user) {
                        navigate("/signin");
                        return;
                      }
                      // Add to wishlist functionality here
                      console.log("Add to wishlist clicked");
                    }}
                    onMouseEnter={() => {
                      if (!user) setShowWishlistTooltip(true);
                    }}
                    onMouseLeave={() => setShowWishlistTooltip(false)}
                  >
                    + Add to Wishlist
                  </button>
                  
                  {!user && showWishlistTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
                      Click to login and add to wishlist
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right: Game List */}
          <GameList
            games={slicedGames}
            activeIndex={activeIndex}
            setActiveIndex={(idx) => {
              setActiveIndex(idx);
              setProgress(0);
            }}
            progress={progress}
          />
        </div>

        {/* Mobile Layout (slider) */}
        <div className="md:hidden w-full max-w-xl sm:max-w-2xl mx-auto flex-col">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
            style={{ scrollBehavior: "smooth" }}
            onScroll={handleScroll}
          >
            {slicedGames.map((game, idx) => (
              <div
                key={idx}
                data-card
                className="snap-center shrink-0 w-[260px] sm:w-[340px]"
              >
                <div
                  className="rounded-2xl bg-cover bg-center relative shadow-lg h-100 sm:h-130 flex flex-col justify-end"
                  style={{
                    backgroundImage: `url(${game.header_image})`,
                    minHeight: 320,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/0 to-black/80 z-0" />
                  <div className="relative z-10 p-4 space-y-2 flex flex-col justify-end h-full">
                    <h2 className="uppercase text-xs font-bold text-white tracking-wide mb-1">
                      {game.smallTitle}
                    </h2>
                    <h1 className="text-lg font-bold mb-1">{game.name}</h1>
                    <p className="text-xs text-white font-semibold whitespace-pre-line mb-2">
                      {game.short_description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Dots navigation */}
          <div className="flex justify-center mt-3 gap-1">
            {slicedGames.map((_, idx) => {
              const currentIdx = getCurrentIndex();
              return (
                <span
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`inline-block w-2 h-2 rounded-full cursor-pointer transition-colors duration-200 ${
                    idx === currentIdx ? "bg-white" : "bg-zinc-700"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameSlider;
