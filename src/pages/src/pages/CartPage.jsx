import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "../api/api";
import { FaTrashAlt } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModel";
import PaymentDetailsModal from "../components/PaymentDetailsModal";

export default function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;
  const userId = parsedUser?.id ?? parsedUser?._id ?? null;
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");

  if (!userId) {
    return (
      <div className="text-white p-8">
        No user ID found in local storage. Please log in.
      </div>
    );
  }

  const { data: cartData = {}, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      const response = await apiConfig.get(`/cart/get/${userId}`);
      return response.data;
    },
  });

  const cartItems = cartData?.cart ?? [];

  const buyAllMutation = useMutation({
    mutationFn: async ({ paymentData }) => {
      const productsPayload = cartItems.map((item) => ({
        name: item.name,
        price: item.price ?? 0,
        type: item.type || "PC",
        imageUrl: item.imageUrl || "",
      }));
      const response = await apiConfig.post("/order/create", {
        userId,
        products: productsPayload,
        orderstatus: "Completed",
        paymentData: paymentData, // send payment data including save card option
      });
      return response.data;
    },
    onSuccess: (data) => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      toast.success(data.message || "Loot Acquired! 🎮", {
        icon: "🏆",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #38bdf8",
        },
      });

      queryClient.setQueryData(["cart", userId], { cart: [] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Purchase failed! ❌", {
        icon: "💥",
        style: {
          background: "#1e1b4b",
          color: "#fff",
          border: "1px solid #f87171",
        },
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const res = await apiConfig.delete(`/cart/delete/${itemId}`);
      return res.data;
    },
    onSuccess: (_, itemId) => {
      toast.success("Item removed from cart 🗑️", {
        icon: "🗑️",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #f87171",
        },
      });

      queryClient.setQueryData(["cart", userId], (oldData) => {
        if (!oldData || !oldData.cart) return { cart: [] };
        return {
          ...oldData,
          cart: oldData.cart.filter((item) => item._id !== itemId),
        };
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to remove item ❌", {
        icon: "💥",
        style: {
          background: "#1e1b4b",
          color: "#fff",
          border: "1px solid #f87171",
        },
      });
    },
  });

  const handleBuyNowClick = () => {
    if (!userId) {
      toast.error("Please login before purchasing 🚪");
      navigate("/login");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);
    
    // For card payments, show details modal
    setShowPaymentDetailsModal(true);
  };

  const handlePaymentDetailsSubmit = (paymentData) => {
    setShowPaymentDetailsModal(false);
    buyAllMutation.mutate({ paymentData: paymentData });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-white p-8">
        <p className="text-lg">Your cart is empty. Start adding games!</p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          onClick={() => (window.location.href = "/")}
        >
          Go to Store
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        "
      </div>
    );
  }

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Your Cart</h1>

        <button
          onClick={handleBuyNowClick}
          disabled={buyAllMutation.isLoading || cartItems.length === 0}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {buyAllMutation.isPending ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Buy All"
          )}
        </button>
      </div>

      {/*  Payment Method Selection Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentMethodSelect}
        />
      )}

      {/* Payment Details Modal */}
      {showPaymentDetailsModal && (
        <PaymentDetailsModal
          onClose={() => setShowPaymentDetailsModal(false)}
          onSubmit={handlePaymentDetailsSubmit}
          paymentMethod={selectedPaymentMethod}
          gameData={{
            name: `${cartItems.length} Game${cartItems.length !== 1 ? 's' : ''}`,
            price: cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2)
          }}
        />
      )}

      {/* 🛍️ Cart Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="bg-[#18181b] rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300 flex flex-col"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover"
            />

            <div className="flex flex-col flex-1 p-5">
              <h2 className="text-xl font-bold mb-2">{item.name}</h2>
              {item.price !== undefined && (
                <p className="text-green-400 text-lg font-semibold">
                  {item.price === 0 ? "Free" : `$${item.price}`}
                </p>
              )}

              {item.rating && (
                <p className="text-sm text-yellow-400 mt-1">
                  Rating: {item.rating.toUpperCase()}
                </p>
              )}

              {item.description && (
                <p className="text-gray-400 text-sm mt-3 line-clamp-3">
                  {item.description}
                </p>
              )}

              <div className="mt-auto pt-4 flex justify-end">
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  onClick={() => deleteItemMutation.mutate(item._id)}
                >
                  <FaTrashAlt /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
