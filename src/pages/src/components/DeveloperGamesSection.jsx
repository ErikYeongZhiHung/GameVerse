import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../api/api";
import { FaStar, FaUser } from "react-icons/fa";

function DeveloperGamesSection() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchDeveloperGames();
  }, []);

  const fetchDeveloperGames = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await apiConfig.get("/product/get/developer-games");
      
      if (response.data.success) {
        setGames(response.data.products);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("Error fetching developer games:", error);
      setIsError(true);
      // If no developer games found, just show empty section
      if (error.response?.status === 404) {
        setGames([]);
        setIsError(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameClick = (game) => {
    // Navigate to product details page with the game data
    navigate("/detials", { 
      state: { 
        game: {
          // Map the product data to match the expected game structure
          name: game.name,
          header_image: game.images?.[0] || "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Game+Image",
          price: game.price,
          description: game.description,
          rating: game.rating,
          type: game.type,
          _id: game._id,
          developer: `${game.userId?.firstname || ''} ${game.userId?.lastname || ''}`.trim(),
          createdAt: game.createdAt
        } 
      } 
    });
  };

  // Don't render anything if no games and not loading
  if (!isLoading && games.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaUser className="text-blue-400 text-xl" />
        <h2 className="text-2xl font-bold text-white">
          Games by Independent Developers
        </h2>
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      
      {isError && (
        <p className="text-red-500 text-center py-4">
          Error loading developer games. Please try again later.
        </p>
      )}

      {!isLoading && !isError && games.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {games.slice(0, 8).map((game, i) => (
            <div
              key={game._id || i}
              onClick={() => handleGameClick(game)}
              className="cursor-pointer p-4 overflow-hidden rounded-lg bg-[#18181b] hover:bg-gray-800 transition-colors duration-300 border border-gray-700 hover:border-blue-500"
            >
              <div className="relative mb-3">
                <img
                  src={game.images?.[0] || "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Game+Image"}
                  alt={game.name}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=Game+Image";
                  }}
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  INDIE
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-semibold text-white text-sm hover:text-blue-400 transition-colors">
                  {game.name}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-green-400 font-bold">
                    ${game.price?.toFixed(2) || "0.00"}
                  </div>
                  {game.rating && (
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-gray-300 text-xs">
                        {game.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  by {game.userId?.firstname || 'Unknown'} {game.userId?.lastname || 'Developer'}
                </div>

                <div className="text-xs text-gray-500 capitalize">
                  {game.type || 'Game'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && games.length > 8 && (
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/developer-games")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
          >
            View All Developer Games ({games.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default DeveloperGamesSection;