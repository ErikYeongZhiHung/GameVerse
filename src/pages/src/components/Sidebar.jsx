import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaGamepad,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
  { name: "Users", path: "/users", icon: <FaUser /> },
  // { name: "Settings", path: "/settings", icon: <FaCog /> },
  { name: "Game Controller", path: "/control-panel", icon: <FaGamepad /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => setOpen(false);

  return (
    <>
      {/* Mobile menu icon */}
      <button
        className="fixed top-3 left-3 z-50 lg:hidden bg-[#232329] p-2.5 rounded-lg text-white shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#18181b] border-r border-[#232329] z-50
          flex flex-col transition-transform duration-300 shadow-xl
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-64 lg:static lg:shadow-none
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#232329]">
          <span className="text-white font-bold text-2xl">LOGO</span>
          <button
            className="text-gray-400 hover:text-white lg:hidden transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-[#232329] hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-[#232329]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-[#232329] hover:text-white transition-all duration-200">
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
