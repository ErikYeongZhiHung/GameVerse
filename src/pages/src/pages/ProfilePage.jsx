import React from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";

export default function ProfilePage() {
  // Example user data
  const user = {
    name: "John Doe",
    email: "john.doe@email.com",
    joined: "2023-01-15",
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-3 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Profile</h1>
      <div className="bg-[#232329] rounded-lg shadow-lg p-6 flex flex-col items-center">
        <FaUserCircle className="text-6xl text-blue-500 mb-4" />
        <div className="text-white text-xl font-semibold mb-2">{user.name}</div>
        <div className="flex items-center text-gray-300 mb-2">
          <FaEnvelope className="mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="text-gray-400 text-sm">Joined: {user.joined}</div>
      </div>
    </div>
  );
}