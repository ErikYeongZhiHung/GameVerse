import React, { useEffect, useState } from "react";
import { apiClient } from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; 

export default function Controller() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const statusColors = {
    active: "bg-green-600",
    inactive: "bg-yellow-500",
  };

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }

  // ✅ Fetch Games
  const {
    data: gamesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["gamesData"],
    queryFn: async () => {
      const res = await apiClient.get("/product/get", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.product;
    },
  });

  useEffect(() => {
    if (gamesData) {
      setGames(gamesData);
    }
  }, [gamesData]);

  // ✅ Update Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return apiClient.put(
        `/product/update/status/${id}`,
        { status }, // <-- body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gamesData"]); // refresh list
    },
  });

  // ✅ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.delete(`/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["gamesData"]);
    },
  });

  // ✅ Handlers
  const handleStatusChange = (id, status) => {
    updateMutation.mutate({ id, status });
    setGames((games) =>
      games.map((game) => (game._id === id ? { ...game, status } : game))
    );
  };

  const handleDelete = (id) => {
    setSelectedGameId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedGameId) return;
    deleteMutation.mutate(selectedGameId, {
      onSuccess: () => {
        setGames((games) =>
          games.filter((game) => game._id !== selectedGameId)
        );
        setShowModal(false);
        setSelectedGameId(null);
      },
    });
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedGameId(null);
  };

  // ✅ Filters
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(search.toLowerCase());
    if (filter === "pending") {
      return matchesSearch && game.status === "inactive";
    }
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (isLoading)
    return <div className="text-white text-center">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Game Controller</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search games..."
          className="w-full sm:w-80 px-4 py-2 border-2 rounded-lg bg-[#232329] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-52 px-4 py-2 rounded-lg bg-[#232329] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Games</option>
          <option value="pending">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-[#232329] rounded-md">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Uploader</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGames.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No games found.
                </td>
              </tr>
            ) : (
              paginatedGames.map((game) => (
                <tr
                  key={game._id}
                  className="border-t border-[#2d2d2d] hover:bg-[#2a2a2e]"
                >
                  <td className="py-3 px-4 text-gray-200 truncate w-[120px]">
                    {game.userId?.email}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {game.name}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {game.userId?.firstname || "N/A"}{" "}
                    {game.userId?.lastname || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs text-white ${
                        statusColors[game.status] || "bg-gray-500"
                      }`}
                    >
                      {game.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        navigate(`/product/${game._id}`, { state: game })
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      View Details
                    </button>
                    {filter === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(game._id, "active")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          {updateMutation.isLoading ? "..." : "Activate"}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(game._id, "inactive")
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs"
                        >
                          {updateMutation.isLoading ? "..." : "Deactivate"}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(game._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      {deleteMutation.isLoading &&
                      selectedGameId === game._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-8 text-white">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-[#1e1e22] rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-white text-xl font-semibold mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-400">
                {games.find((game) => game._id === selectedGameId)?.name ||
                  "this game"}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
