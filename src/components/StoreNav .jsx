// ✅ StoreNav.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSpinner, FaTimes } from "react-icons/fa";
import { apiConfig } from "../api/api";
import axios from "axios";

const navLinks = [
  { name: "Discover", value: "discover" },
  { name: "Browse", value: "browse" },
  { name: "News", value: "news" },
];

const fetchGames = async (q) => {
  if (!q || q.length < 2) return [];

  try {
    const [searchResults, latestGames, mostPlayedGames] =
      await Promise.allSettled([
        axios.get(`/games/search?q=${q}`).then((res) => res.data?.data || []),
        apiConfig.get("/steam/games/latest").then((res) => res.data?.data || []),
        apiConfig.get("/steam/games/motplayed").then((res) => res.data?.data || []),
      ]);

    const allResults = [];

    if (searchResults.status === "fulfilled" && Array.isArray(searchResults.value)) {
      allResults.push(
        ...searchResults.value.map((game) => ({ ...game, source: "search" }))
      );
    }

    if (latestGames.status === "fulfilled" && Array.isArray(latestGames.value)) {
      const filteredLatest = latestGames.value.filter((game) =>
        game.name?.toLowerCase().includes(q.toLowerCase())
      );
      allResults.push(
        ...filteredLatest.map((game) => ({ ...game, source: "latest" }))
      );
    }

    if (mostPlayedGames.status === "fulfilled" && Array.isArray(mostPlayedGames.value)) {
      const filteredMostPlayed = mostPlayedGames.value.filter((game) =>
        game.name?.toLowerCase().includes(q.toLowerCase())
      );
      allResults.push(
        ...filteredMostPlayed.map((game) => ({ ...game, source: "mostplayed" }))
      );
    }

    // remove duplicates
    const uniqueResults = allResults.filter(
      (game, index, self) =>
        index ===
        self.findIndex(
          (g) =>
            (game.appid && g.appid === game.appid) ||
            (game.name && g.name === game.name)
        )
    );

    return uniqueResults.slice(0, 20);
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

const StoreNav = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(navLinks[0]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState("");

  const dropdownRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch,
  } = useQuery({
    queryKey: ["search", debouncedTerm],
    queryFn: () => fetchGames(debouncedTerm),
    enabled: false, // ❌ Don't auto fetch
    staleTime: 5 * 60 * 1000,
  });

  // Trigger default message when no results
  useEffect(() => {
    if (!isSearchLoading && searchTerm.length >= 2 && searchResults.length === 0) {
      setNoResultsMessage(`No game found for "${searchTerm}" 😔`);
    } else {
      setNoResultsMessage("");
    }

    setShowSearchResults(
      searchTerm.length >= 2 &&
        (searchResults.length > 0 || isSearchLoading || isSearchError || noResultsMessage)
    );
  }, [searchTerm, searchResults, isSearchLoading, isSearchError, noResultsMessage]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    if (open || showSearchResults) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, showSearchResults]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim().length >= 2) {
      refetch(); // 🔥 Trigger search on Enter
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    setNoResultsMessage("");
    queryClient.removeQueries(["search"]);
  };

  const handleGameClick = (game) => {
    setShowSearchResults(false);
    setSearchTerm("");

    navigate(`/details`, {
      state: {
        game: {
          ...game,
          name: game.name,
          header_image: game.header_image || game.image,
          short_description: game.short_description || game.description,
          detailed_description: game.detailed_description,
          price_overview: game.price_overview || {
            final_formatted: game.price || "Free",
            initial: game.oldPrice
              ? parseFloat(game.oldPrice.replace(/[^0-9.]/g, "")) * 100
              : null,
          },
          ratings: game.ratings || { dejus: { rating: game.rating || 0 } },
          release_date: game.release_date || { date: game.date || "Unknown" },
          steam_appid: game.appid || game.steam_appid,
          productId: game.productId,
          logo: game.logo,
        },
      },
    });
  };

  return (
    <nav className="w-full px-6 py-8 flex items-center justify-between">
      <div className="hidden lg:flex flex-1 items-center gap-8">
        {/* Search */}
        <div ref={searchRef} className="flex flex-col items-start max-w-md w-full relative">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              {isSearchLoading ? <FaSpinner className="animate-spin" size={15} /> : <FaSearch size={15} />}
            </span>
            <input
              type="text"
              placeholder="Search games, genres, developers..."
              className="w-full pl-10 pr-12 py-3 rounded-full bg-white/20 text-white placeholder-zinc-400 outline-none border-none focus:bg-white/30 transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full bg-[#18181c] border border-zinc-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {isSearchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin text-zinc-400 mr-2" />
                  <span className="text-zinc-400">Searching games...</span>
                </div>
              ) : isSearchError ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-red-400 mb-2">Search failed</p>
                  <p className="text-zinc-400 text-sm">Please try again</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="px-2 py-1 text-xs text-zinc-400 border-b border-zinc-700 mb-2">
                    Found {searchResults.length} game{searchResults.length !== 1 ? "s" : ""}
                  </div>
                  {searchResults.map((game) => (
                    <div
                      key={game.appid || game.name}
                      onClick={() => handleGameClick(game)}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors group"
                    >
                      <img
                        src={game.header_image || game.image || "/placeholder-game.jpg"}
                        alt={game.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => (e.target.src = "/placeholder-game.jpg")}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                          {game.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {game.price && (
                            <span className="text-green-400 text-sm font-semibold">{game.price}</span>
                          )}
                          {game.discount && (
                            <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full">
                              {game.discount}
                            </span>
                          )}
                          {game.source && (
                            <span className="text-xs text-zinc-500 capitalize">{game.source}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : noResultsMessage ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-zinc-400 mb-2">{noResultsMessage}</p>
                  <p className="text-zinc-500 text-sm">Try a different search term</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex gap-6 ml-8">
          {navLinks.map((link) => (
            <button
              key={link.value}
              className={`text-base ${
                selected.value === link.value
                  ? "text-white font-semibold"
                  : "text-zinc-300 hover:text-white"
              } transition`}
              onClick={() => setSelected(link)}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default StoreNav;
