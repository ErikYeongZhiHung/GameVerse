// components/UploadGame.jsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiConfig } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UploadGame() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const userIdFromStorage = parsedUser.id || "";
  const userToken = parsedUser.token || "";

  const [form, setForm] = useState({
    userId: userIdFromStorage,
    name: "",
    description: "",
    price: "",
    rating: "",
    stock: "",
    images: [],
    type: "game",
  });
  const [statusMsg, setStatusMsg] = useState(null);

  // Bulk image-upload mutation
  const uploadImagesMutation = useMutation({
    mutationFn: (files) => {
      const fd = new FormData();
      files.forEach((file) => fd.append("images", file));
      return apiConfig.post("/upload", fd, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      const uploadedUrl = response.data.imageUrl;
      setForm((prev) => ({ ...prev, images: [...prev.images, uploadedUrl] }));
      setStatusMsg({ type: "success", msg: "Image uploaded!" });
    },
    onError: (err) => {
      setStatusMsg({ type: "error", msg: `Upload failed: ${err.message}` });
    },
  });

  // Create-game mutation
  const createGameMutation = useMutation({
    mutationFn: (payload) =>
      apiConfig.post("/product/create", payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }),
    onSuccess: () => {
      setStatusMsg({ type: "success", msg: "🎉 Upload successful!" });
      setForm({
        userId: userIdFromStorage,
        name: "",
        description: "",
        price: "",
        rating: "",
        stock: "",
        images: [],
        type: "game",
      });
    },
    onError: (err) =>
      setStatusMsg({ type: "error", msg: `Upload failed: ${err.message}` }),
  });

  // Validation
  const isValid =
    form.userId &&
    form.name &&
    form.description &&
    +form.price > 0 &&
    +form.rating >= 0 &&
    +form.rating <= 5 &&
    +form.stock >= 0;

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Immediate file upload on select
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    uploadImagesMutation.mutate(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createGameMutation.mutate({
      ...form,
      price: +form.price,
      rating: +form.rating,
      stock: +form.stock,
    });
  };

  // Auto-clear status
  useEffect(() => {
    if (!statusMsg) return;
    const tm = setTimeout(() => setStatusMsg(null), 5000);
    return () => clearTimeout(tm);
  }, [statusMsg]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-gray-700 p-8 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-semibold text-white text-center">
          Upload New Game
        </h2>

        {/* Name & Description */}
        <div>
          <label className="block text-gray-300 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Game Title"
            required
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Game description..."
            required
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price, Rating, Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "price", label: "Price ($)", type: "number", step: "0.01" },
            {
              name: "rating",
              label: "Rating (0–5)",
              type: "number",
              step: "0.1",
              min: 0,
              max: 5,
            },
            { name: "stock", label: "Stock", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-300 mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                step={field.step}
                min={field.min}
                max={field.max}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Multi-file input */}
        <div>
          <label className="block text-gray-300 mb-1">Select Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full text-gray-400"
          />
          {uploadImagesMutation.isLoading && (
            <p className="text-yellow-300">Uploading images…</p>
          )}
          <div className="flex space-x-2 mt-2">
            {form.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Game ${i}`}
                className="h-16 w-16 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          {createGameMutation.isLoading ? "Submitting…" : "Create Game"}
        </button>

        {statusMsg && (
          <div
            className={`text-center text-sm ${
              statusMsg.type === "success" ? "text-green-300" : "text-red-400"
            }`}
          >
            {statusMsg.msg}
          </div>
        )}
      </form>
    </div>
  );
}
