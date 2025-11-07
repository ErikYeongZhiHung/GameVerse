import React from 'react';
import Sidebar from '../components/Sidebar';

function NavLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#232329]">
      <Sidebar />
      {/* Add left margin on large screens to avoid content under fixed sidebar */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#232329] ">
        {children}
      </main>
    </div>
  );
}

export default NavLayout;