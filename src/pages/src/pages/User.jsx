import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/api";

export default function User() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: usersData = { users: [] },
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["usersData"],
    queryFn: async () => {
      const res = await apiClient.get("/auth/getUser");
      return res.data;
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      const res = await apiClient.delete(`/auth/delete/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["usersData"]); // Refresh list
      setShowModal(false); // Close modal only on success
      setSelectedUser(null);
    },
  });

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
      <div className="text-center text-red-500 py-6">
        Error fetching users: {error.message}
      </div>
    );
  }
  console.log("====>", usersData);

  const filteredUsers = (usersData.user || []).filter((user) => {
    const q = search.toLowerCase();
    return (
      user._id?.toLowerCase().includes(q) ||
      user.firstname?.toLowerCase().includes(q) ||
      user.lastname?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Users</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by Name, Email, or ID..."
          className="w-full sm:w-80 px-4 py-2 rounded-lg border-2 bg-[#232329] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-[#232329] rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left text-gray-300">
              <th className="py-3 px-4">S/No </th>
              <th className="py-3 px-4">First Name</th>
              <th className="py-3 px-4">Last Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t border-[#2d2d2d] hover:bg-[#28282c] transition"
                >
                  <td className="py-3 px-4 text-gray-200">{index + 1}</td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {user.firstname}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {user.lastname}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{user.email}</td>
                  <td className="py-3 px-4 text-gray-200 capitalize">
                    {user.role || "user"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                    {/* Confirmation Modal */}
                    {showModal && selectedUser && (
                      <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-[#232329] rounded-lg p-6 w-96 text-white">
                          <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                          </h2>
                          <p>
                            Are you sure you want to delete{" "}
                            <span className="font-bold">
                              {selectedUser.firstname} {selectedUser.lastname}
                            </span>
                            ?
                          </p>
                          <div className="mt-6 flex justify-end gap-3">
                            <button
                              onClick={() => setShowModal(false)}
                              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() =>
                                deleteUser.mutate(selectedUser._id)
                              }
                              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                            >
                              {deleteUser.isLoading ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No users found.</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-[#232329] rounded-lg p-4 shadow flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">User ID:</span>
                <span className="text-sm text-gray-200">{user._id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Name:</span>
                <span className="text-white font-semibold">
                  {user.firstname} {user.lastname}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Email:</span>
                <span className="text-gray-300">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Role:</span>
                <span className="text-gray-200 capitalize">
                  {user.role || "user"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Joined:</span>
                <span className="text-gray-400">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
