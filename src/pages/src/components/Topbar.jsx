import { FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <header className="w-full h-14 flex items-center justify-between px-4 md:px-8 bg-[#18181b] border-b border-[#232329] fixed top-0 left-0 z-20" style={{marginLeft: '56px'}}>
      <div className="flex items-center gap-4">
        <span className="text-white font-bold text-lg">STORE</span>
        <span className="text-gray-400 text-sm hidden md:inline">Explore</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Sign In</button>
        <FaUserCircle className="text-white text-2xl" />
      </div>
    </header>
  );
}