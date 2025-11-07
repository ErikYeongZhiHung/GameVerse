export default function GameSection({ title, games }) {
  return (
    <section className="mb-8">
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {games.map((game, idx) => (
          <div key={idx} className="bg-[#232329] rounded-lg w-40 min-w-[160px] p-2 flex-shrink-0">
            <img src={game.image} alt={game.title} className="rounded mb-2 w-full h-24 object-cover" />
            <div className="text-white text-sm font-bold">{game.title}</div>
            <div className="text-gray-400 text-xs">{game.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}