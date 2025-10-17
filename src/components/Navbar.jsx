import React, { useState } from "react";
import { FiGlobe, FiMenu, FiX, FiChevronDown, FiUser } from "react-icons/fi";
import { TiShoppingCart } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import logo from "/public/assets/images/logo.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("user in navbar", user);

  return (
    <>
      <nav className="bg-[#121216] text-white px-4 py-3 flex justify-between items-center shadow-md ">
        {/* Left side - Logo and Links */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Epic Games" className="w-10 h-10" />
            <FiChevronDown size={14} />
          </div>
          <Link
            to={"/"}
            className="font-bold uppercase hidden sm:inline text-xl cursor-pointer"
          >
            Home
          </Link>
          <span className="hidden sm:inline font-semibold">Support</span>
        </div>

        {/* Right side - Auth buttons and Icons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm mr-2 uppercase">
                Hi,{" "}
                {user.name || `${user.firstname || ""} ${user.lastname || ""}`}
              </span>

              {/* Profile Icon */}
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 transition"
                title="Go to Profile"
              >
                <FiUser size={18} />
              </button>

              {/* Logout Button */}
              <button
                className="bg-zinc-700 cursor-pointer hover:bg-zinc-600 text-sm px-3 py-1 rounded-md"
                onClick={logout}
              >
                Logout
              </button>

              {/* Cart - only for user */}
              {user.role === "user" && (
                <Link
                  to={"/cart"}
                  className="bg-amber-500 hover:bg-amber-600 text-sm px-3 py-1 rounded-md"
                >
                  Cart
                </Link>
              )}

              {/* Upload Game - only for developer */}
              {user.role === "developer" && (
                <Link
                  to={"/upload"}
                  className="bg-sky-500 hover:bg-sky-600 text-sm px-3 py-1 rounded-md"
                >
                  Upload Game
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/signup">
                <button className="bg-zinc-700 cursor-pointer hover:bg-zinc-600 text-sm px-3 py-1 rounded-md">
                  Register
                </button>
              </Link>
              <Link to="/signin">
                <button className="bg-zinc-700 cursor-pointer hover:bg-zinc-600 text-sm px-3 py-1 rounded-md">
                  Login
                </button>
              </Link>
            </>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="sm:hidden text-white ml-2"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 sm:hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700">
            <span className="uppercase font-bold text-lg">Store</span>
            <div className="flex items-center gap-3">
              <button className="bg-sky-500 text-sm px-3 py-1 rounded-md">
                Download
              </button>
              <FiX
                size={24}
                className="text-white cursor-pointer"
                onClick={() => setMobileOpen(false)}
              />
            </div>
          </div>

          <div className="px-4 py-4 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <FiGlobe />
              {user ? (
                <button
                  className="bg-red-500 text-sm px-3 py-1 rounded-md"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/signin">
                  <button className="bg-zinc-700 text-sm px-3 py-1 rounded-md">
                    Sign in
                  </button>
                </Link>
              )}
            </div>

            <h2 className="text-white font-bold text-xl">Menu</h2>

            <div className="flex flex-col gap-4 text-white">
              <span className="text-base">Support</span>
              <select
                className="bg-zinc-800 text-white rounded px-2 py-1 mt-1"
                style={{ minWidth: 110 }}
              >
                <option className="text-black" value="">
                  Distribute
                </option>
                <option className="text-black" value="dev">
                  For Developers
                </option>
                <option className="text-black" value="pub">
                  For Publishers
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
