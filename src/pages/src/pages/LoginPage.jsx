import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/api";
import { useMutation } from "@tanstack/react-query";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!email || !password) {
        throw new Error("Email and Password are required");
      }
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.user?.role === "admin") {
        localStorage.setItem("token", data.user.token);
        console.log("login ", data.user.token);
        navigate("/dashboard"); // change path if needed
      } else {
        setError("Access denied: Admins only");
      }
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err.message);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
      <form
        onSubmit={handleLogin}
        className="bg-[#232329] p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded bg-[#18181b] text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded bg-[#18181b] text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
