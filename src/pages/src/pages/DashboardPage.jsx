import React from "react";
import { apiClient } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const stats = [
//   { label: "Total Orders", value: 128, color: "bg-blue-600" },
//   { label: "Active Users", value: 54, color: "bg-green-600" },
//   { label: "Games Listed", value: 23, color: "bg-purple-600" },
//   { label: "Pending Orders", value: 3, color: "bg-yellow-500" },
// ];

// const topGames = [
//   {
//     name: "Fortnite",
//     image:
//       "https://cdn2.unrealengine.com/egs-out-of-time-carousel-mobile-1200x1600-986d3cb9cf07.jpg?resize=1&w=640&h=854&quality=medium",
//     orders: 40,
//   },
//   {
//     name: "Rocket League",
//     image:
//       "https://cdn2.unrealengine.com/egs-battlefield-6-carousel-mobile-1200x1600-47e24a810812.jpg?resize=1&w=640&h=854&quality=medium",
//     orders: 22,
//   },
//   {
//     name: "Spider-Man 2",
//     image:
//       "https://cdn2.unrealengine.com/egs-fortnite-fantastic-four-carousel-mobile-1200x1600-96a627d21141.jpg?resize=1&w=640&h=854&quality=medium",
//     orders: 15,
//   },
// ];

const recentOrders = [
  {
    id: "ORD-1004",
    gamename: "LUTO",
    user: "user4@email.com",
    price: "$14.99",
    status: "Completed",
  },
  {
    id: "ORD-1003",
    gamename: "Spider-Man 2",
    user: "user3@email.com",
    price: "$49.99",
    status: "Refunded",
  },
  {
    id: "ORD-1002",
    gamename: "Rocket League",
    user: "user2@email.com",
    price: "$19.99",
    status: "Pending",
  },
];

const statusColors = {
  Completed: "bg-green-600",
  Pending: "bg-yellow-500",
  Refunded: "bg-red-600",
};

export default function DashboardPage() {
  const { data: statsData } = useQuery({
    queryKey: ["stasts"],
    queryFn: async () => {
      const res = await apiClient.get("/stats");
      return res.data;
    },
  });
  const stats = statsData
    ? [
        {
          label: "Total Orders",
          value: statsData.data.totalOrders,
          color: "bg-blue-600",
        },
        {
          label: "Active Users",
          value: statsData.data.user,
          color: "bg-green-600",
        },
        {
          label: "Games Listed",
          value: statsData.data.totalGames,
          color: "bg-purple-600",
        },
        {
          label: "Pending Orders",
          value: statsData.data.pendingOrders,
          color: "bg-yellow-500",
        },
      ]
    : [];

  console.log(stats);
  console.log(statsData);

  const {
    data: latestgamesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await apiClient.get("/steam/games/latest");
      return response.data.data;
    },
  });

  console.log("latestgamesData", latestgamesData);

  const { data: recentOrdersData } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await apiClient.get("/order/get");
      return res.data;
    },
  });
  console.log("recentOrderData", recentOrdersData);

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
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg">Error: {error.message}</div>
      </div>
    );
  }
  return (
    <div className="w-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-7xl mx-auto py-4 xs:py-6 md:py-8 lg:py-10">
      <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 xs:mb-6 md:mb-8">
        Dashboard
      </h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 mb-6 xs:mb-8 md:mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col items-center ${stat.color} text-white shadow-lg hover:shadow-xl transition-shadow duration-200`}
          >
            <div className="text-xl xs:text-2xl  sm:text-3xl md:text-4xl font-bold">
              {stat.value}
            </div>
            <div className="text-xs xs:text-sm sm:text-base md:text-lg mt-1 text-center">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      {/* Top Games */}
      <div className="mb-6 xs:mb-8 md:mb-10">
        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 xs:mb-4 md:mb-5">
          Top Games
        </h2>
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {latestgamesData.map((game, idx) => (
            <div
              key={idx}
              // to="/detials"
              // state={{ game }}
              data-card // <-- This enables scroll buttons to work!
              className="
                relative group rounded-xl 
                w-48 flex-shrink-0 snap-start transition-shadow duration-200 hover:shadow-2xl
                md:w-[19%]
              "
              style={{ minWidth: "192px" }} // match w-48 (12rem)
            >
              <button
                className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-1.5"
                title="Add to wishlist"
                onClick={(e) => e.preventDefault()}
              >
                <FaPlus className="text-white text-lg" />
              </button>
              <div
                className="h-65 w-full rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${game.header_image})`,
                  minHeight: "260px",
                }}
              />
              <div className="py-3">
                <div className="text-xs text-zinc-400">{game.type}</div>
                <div className="font-bold text-white text-base leading-tight mb-1">
                  {game.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full font-bold">
                    {game?.price_overview?.initial}
                  </span>
                  <span className="text-white text-sm font-semibold">
                    {game?.price_overview?.final_formatted}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Orders */}
      <div>
        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 xs:mb-4 md:mb-5">
          Recent Orders
        </h2>
        {/* Desktop/Tablet Table */}
        <div className="hidden sm:block rounded-lg shadow-lg overflow-hidden">
          <table className="w-full table-fixed bg-[#232329] text-xs sm:text-sm md:text-base lg:text-lg">
            <thead>
              <tr className="text-left text-gray-300 bg-[#1a1a1f]">
                <th className="w-32 py-3 px-4">Order ID</th>
                <th className="w-48 py-3 px-4">Game</th>
                <th className="w-56 py-3 px-4 hidden md:table-cell">User</th>
                <th className="w-24 py-3 px-4">Price</th>
                <th className="w-28 py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrdersData?.orders?.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-[#2d2d2d] hover:bg-[#28282c] transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-200 truncate">
                    {order._id}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold truncate">
                    {order.products?.[0]?.name}
                  </td>
                  <td className="py-3 px-4 text-gray-300 hidden md:table-cell truncate">
                    {order.userId?.email}
                  </td>
                  <td className="py-3 px-4 text-gray-200 whitespace-nowrap">
                    ${order.products?.[0]?.price}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs md:text-sm text-white ${
                        statusColors[order.orderstatus]
                      }`}
                    >
                      {order.orderstatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-2 xs:gap-3">
          {recentOrdersData?.orders?.map((order) => (
            <div
              key={order._id}
              className="bg-[#232329] rounded-lg p-3 xs:p-4 shadow-lg"
            >
              <div className="flex justify-between mb-1.5 text-xs xs:text-sm">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-gray-200 font-medium truncate">
                  {order._id}
                </span>
              </div>
              <div className="flex justify-between mb-1.5 text-xs xs:text-sm">
                <span className="text-gray-400">Game:</span>
                <span className="text-white font-semibold truncate">
                  {order.products?.[0]?.name}
                </span>
              </div>
              <div className="flex justify-between mb-1.5 text-xs xs:text-sm">
                <span className="text-gray-400">User:</span>
                <span className="text-gray-300 truncate max-w-[150px] xs:max-w-[180px]">
                  {order.userId?.email}
                </span>
              </div>
              <div className="flex justify-between mb-1.5 text-xs xs:text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-gray-200 font-medium">
                  ${order.products?.[0]?.price}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs xs:text-sm">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs text-white ${
                    statusColors[order.orderstatus]
                  }`}
                >
                  {order.orderstatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
