import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GameRecommendationBot from "../components/GameRecommendationBot";

function NavLayout({ children }) {
  return (
    <div className="bg-[#121216] ">
      <Navbar />
      {children}
      <Footer />
      <GameRecommendationBot />
    </div>
  );
}

export default NavLayout;
