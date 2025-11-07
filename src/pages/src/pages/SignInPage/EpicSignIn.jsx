import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiConfig } from "../../api/api";
import { useAuth } from "../../context/AuthContext"; // Import the hook
import { useNavigate } from "react-router-dom"; // For redirect

const signInUser = async (userData) => {
  const response = await apiConfig.post("/auth/login", userData);
  return response.data;
};

const EpicSignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  // Mutation hook
  const mutation = useMutation({
    mutationFn: signInUser,
    onSuccess: (data) => {
      setMessage(" Login successful!");
      login(data.user || { email: form.email });
      setForm({ email: "", password: "" });
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 1000);
    },
    onError: (error) => {
      setMessage(" Error logging in. Please try again.");
      console.error(error);
    },
  });

  // Input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181c] p-4">
      <div className="w-full max-w-[400px] bg-[#23232b] p-6 rounded-2xl shadow-lg border-2 border-zinc-700 space-y-5">
        <h2 className="text-white text-lg font-semibold text-center mb-2">
          Epic Games Sign In
        </h2>

        <form
          className="space-y-4 border border-zinc-700 rounded-lg p-6 bg-transparent"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-xs text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold mt-2 transition"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Signing in..." : "Sign In"}
          </button>

          {message && (
            <div className="text-center text-xs text-green-400 mt-2">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EpicSignIn;
