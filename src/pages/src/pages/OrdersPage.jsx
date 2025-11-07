import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/api";

const statusColors = {
  Completed: "bg-green-600",
  Pending: "bg-yellow-500",
  Refunded: "bg-red-600",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");

  const {
    data: recentOrdersData = { orders: [] },
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["ordersData"],
    queryFn: async () => {
      const res = await apiClient.get("/order/get");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-6">Loading orders...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-6">
        Error fetching orders: {error.message}
      </div>
    );
  }

  const filteredOrders = (recentOrdersData.orders || []).filter((order) => {
    const q = search.toLowerCase();
    const productName = order.products?.[0]?.name || "";
    const email = order.userId?.email || "";
    return (
      order._id?.toLowerCase().includes(q) ||
      productName.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      order.orderstatus?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Orders</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by Order ID, Game, Email, or Status..."
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
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Game Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const product = order.products?.[0] || {};
                return (
                  <tr
                    key={order._id}
                    className="border-t border-[#2d2d2d] hover:bg-[#28282c] transition"
                  >
                    <td className="py-3 px-4 text-gray-200">{order._id}</td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {product.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {order.userId?.email || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-200">
                      ${product.price || "0.00"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white ${
                          statusColors[order.orderstatus] || "bg-gray-500"
                        }`}
                      >
                        {order.orderstatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No orders found.</div>
        ) : (
          filteredOrders.map((order) => {
            const product = order.products?.[0] || {};
            return (
              <div
                key={order._id}
                className="bg-[#232329] rounded-lg p-4 shadow"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Order ID:</span>
                  <span className="text-sm text-gray-200">{order._id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Game:</span>
                  <span className="text-white font-semibold">
                    {product.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Email:</span>
                  <span className="text-gray-300">
                    {order.userId?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Price:</span>
                  <span className="text-gray-200">
                    ${product.price || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs text-white ${
                      statusColors[order.orderstatus] || "bg-gray-500"
                    }`}
                  >
                    {order.orderstatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Date:</span>
                  <span className="text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
