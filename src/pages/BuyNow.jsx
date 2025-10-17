import { FaWindows } from "react-icons/fa";

export default function BuyNowPage({ game }) {
  if (!game) {
    return (
      <div className="text-white p-8">
        <p>No game selected for purchase.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">
        Buy Now
      </h1>
      <div className="bg-[#232329] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start shadow">
        {/* Game Image */}
        <img
          src={game.header_image}
          alt={game.name}
          className="w-32 h-36 object-cover rounded-lg mb-2 md:mb-0"
        />
        {/* Game Info and Payment */}
        <div className="flex-1 w-full">
          <div className="flex flex-wrap gap-2 mb-2">
            {(game.tags || ["Base Game"]).map((tag) => (
              <span
                key={tag}
                className="bg-[#18181b] text-white text-xs px-2 py-1 rounded font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-white font-bold text-lg">{game.name}</div>
            <div className="flex items-center gap-2">
              {game?.price_overview?.initial && (
                <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium line-through mr-2">
                  RM {game.price_overview.initial / 100}
                </span>
              )}
              <span className="text-2xl font-bold text-green-400">
                {game?.price_overview?.final_formatted
                  ? game.price_overview.final_formatted
                      .replace("$", "RM ")
                      .replace("USD", "")
                  : "Free"}
              </span>
            </div>
          </div>
          {/* Platform */}
          {/* <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <FaWindows className="text-lg" />
            <span>Windows</span>
          </div> */}
          {/* Payment Summary */}
          <div className="bg-[#18181b] rounded-lg p-4 mb-4">
            <div className="flex justify-between text-gray-300 mb-2">
              <span>Price</span>
              <span className="text-white text-sm font-semibold">
                {game?.price_overview?.final_formatted
                  ? game.price_overview.final_formatted
                      .replace("$", "RM ")
                      .replace("USD", "")
                  : "Free"}
              </span>
            </div>

            <hr className="border-[#35353a] my-3" />
            <div className="flex justify-between text-white font-bold text-lg mb-2">
              <span>Total</span>
              <span>
                {game?.price_overview?.initial && (
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium line-through mr-2">
                    RM {game.price_overview.initial / 100}
                  </span>
                )}
              </span>
            </div>
          </div>
          {/* Confirm Button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
