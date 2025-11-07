import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const statusColors = {
  active: "bg-green-600",
  inactive: "bg-yellow-500",
  pending: "bg-yellow-500",
  rejected: "bg-red-600",
};

export default function ProductDetails() {
  const { state: game } = useLocation();
  const navigate = useNavigate();

  if (!game) {
    return (
      <div className="text-white text-center py-10">
        No product data found.{" "}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-2 sm:px-4 md:px-6">
      <div className="bg-[#232329] rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="flex-shrink-0 flex flex-col gap-3 items-center md:w-1/3">
          {Array.isArray(game.images) && game.images.length > 0 ? (
            <img
              src={game.images[0]}
              alt={game.name}
              className="rounded-lg w-full max-w-xs object-cover aspect-square border border-[#2d2d2d]"
            />
          ) : (
            <div className="w-full max-w-xs h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {/* Thumbnails if multiple images */}
          {Array.isArray(game.images) && game.images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {game.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className="w-12 h-12 object-cover rounded border border-[#2d2d2d]"
                />
              ))}
            </div>
          )}
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {game.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs text-white capitalize ${
                  statusColors[game.status] || "bg-gray-500"
                }`}
              >
                {game.status}
              </span>
              <span className="text-gray-400 text-xs">
                Uploaded:{" "}
                {game.createdAt
                  ? new Date(game.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Uploader:</span>{" "}
              <span className="text-white">
                {game.userId?.firstname} {game.userId?.lastname}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Email:</span>{" "}
              <span className="text-white">{game.userId?.email}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Type:</span>{" "}
              <span className="text-white capitalize">{game.type}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Price:</span>{" "}
              <span className="text-white">${game.price}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Stock:</span>{" "}
              <span className="text-white">{game.stock}</span>
            </div>
            <div className="mb-3">
              <span className="font-semibold text-gray-300">Rating:</span>{" "}
              <span className="text-white">{game.rating}</span>
            </div>
            {game.description && (
              <div className="mt-4">
                <span className="font-semibold text-gray-300">
                  Description:
                </span>
                <p className="text-gray-200 mt-1">{game.description}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition w-full md:w-auto"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
