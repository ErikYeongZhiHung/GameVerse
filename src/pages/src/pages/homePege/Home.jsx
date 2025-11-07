import React from "react";
import GameSlider from "../../components/Slider/GameSlider";
import FreeGamesSection2 from "../../components/SectionColumn";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useMostPlayedGames } from "../../components/Data/FreeGamesSection2Data";
import TopSummer from "../../components/TopSummer/TopNewReleasee";
import Indiegame from "../../components/Indiegame";
import DeveloperGamesSection from "../../components/DeveloperGamesSection";
function Home() {
  const { data: mostPlayedGames, isLoading, isError } = useMostPlayedGames();

  // Only slice if data is available
  const mostPlayeddata = mostPlayedGames ? mostPlayedGames.slice(0, 8) : [];

  console.log("mostPlayed data", mostPlayeddata);

  const sections = [
    // { title: "Top Sellers", items: topSellers },
    { title: "Most Played", items: mostPlayeddata, isLoading, isError },
    // { title: "Top Upcoming Wishlisted", items: upcoming, type: "upcoming" },
  ];

  const buttonLabel = "See In Shop";
  const buttonIcon = <FaExternalLinkAlt className="ml-1 text-xs" />;
  const buttonClass =
    "mt-auto inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-5 py-2 rounded-lg transition text-base";

  return (
    <div className="bg-[#121216] max-w-6xl mx-auto py-6 px-4 md:px-22">
      <GameSlider />
      <div className="mt-10">
        <TopSummer />
      </div>
      <FreeGamesSection2 sections={sections} />
      <DeveloperGamesSection />
      <div>
        <Indiegame />
      </div>
    </div>
  );
}

export default Home;
