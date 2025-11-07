import React from "react";
import { FaCog } from "react-icons/fa";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-3 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Settings</h1>
      <div className="bg-[#232329] rounded-lg shadow-lg p-6 flex flex-col items-center">
        <FaCog className="text-5xl text-blue-500 mb-4" />
        <div className="text-white text-lg font-semibold mb-2">Settings Panel</div>
        <div className="text-gray-400 text-center">
          This is a placeholder for your settings. Add your settings controls here!
        </div>
      </div>
    </div>
  );
}