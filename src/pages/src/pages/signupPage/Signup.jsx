import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiConfig } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const createUser = async (userData) => {
  const response = await apiConfig.post("/auth/register", userData);
  return response.data;
};

const Signup = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setMessage("User created successfully!");
      login(data.user);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "user",
      });
      console.log("here it is", data);

      setMessage("");
      navigate("/check-email");
    },
    onError: (error) => {
      setMessage("Error creating user. Please try again.");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*\d).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setMessage(
        "Password must be at least 8 characters long and contain at least one number."
      );
      return;
    }

    if (form.password !== form.confirmpassword) {
      setMessage("Passwords do not match.");
      return;
    }

    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181c] p-4">
      <div className="w-full max-w-[400px] bg-[#23232b] p-6 rounded-2xl shadow-lg border-2 border-zinc-700 space-y-5">
        <h2 className="text-white text-lg font-semibold text-center mb-2">
          Epic Games Form
        </h2>

        <form
          className="space-y-4 border border-zinc-700 rounded-lg p-6 bg-transparent"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-xs text-zinc-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
          </div>

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
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Must be at least{" "}
              <span className="text-blue-400">8 characters</span> long and
              include <span className="text-blue-400">at least one number</span>
              .
            </p>
          </div>

          <div>
            <label className="block text-xs text-zinc-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmpassword"
              value={form.confirmpassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white placeholder-zinc-400 outline-none border border-zinc-700 focus:border-blue-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs text-zinc-300 mb-1">
              Select Your Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-zinc-900 text-white outline-none border border-zinc-700 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="developer">Developer</option>
            </select>
          </div>

          {/* Submit Button with Loader */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold mt-2 transition flex justify-center items-center"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading && (
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                role="status"
              ></div>
            )}
            {mutation.isLoading ? "Submitting..." : "Submit"}
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

export default Signup;
