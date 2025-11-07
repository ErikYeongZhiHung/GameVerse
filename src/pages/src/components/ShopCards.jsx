import React, { useRef, useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const ShopCards = ({
  shopCards,
  buttonLabel,
  buttonIcon,
  buttonClass,
  heading,
  type,
}) => {
  const scrollRef = useRef(null);
  const [current, setCurrent] = useState(0);

  // For slider: update current index on scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const card = container.querySelector("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16; // 16px = mx-2
      const scrollLeft = container.scrollLeft;
      const idx = Math.round(scrollLeft / cardWidth);
      setCurrent(idx);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
    <div className="w-full py-6">
      {/* Heading for slider (mobile, sm, md) */}
      <div className="lg:hidden block">
        <h2 className="text-2xl font-bold text-white ml-3 mt-6">{heading}</h2>
      </div>
      {/* Slider: mobile, sm, md */}
      <div className="lg:hidden relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory mt-10"
          style={{ scrollBehavior: "smooth" }}
        >
          {shopCards.map((card, idx) => (
            <div
              key={idx}
              data-card
              className="group rounded-2xl shadow-md flex-shrink-0 snap-center mx-2 flex flex-col transition hover:shadow-xl
                w-[66.66vw] sm:w-[50vw] md:w-[50vw] max-w-[300px]"
            >
              <div className="relative flex justify-center items-center">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-56 object-cover rounded-lg"
                />
                <button
                  className="absolute top-3 right-3 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Add to wishlist"
                >
                  <FaPlus className="text-white text-lg" />
                </button>
              </div>
              <div className="py-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1 text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-300 mb-4">{card.description}</p>
                <a href={card.link} className={buttonClass}>
                  {buttonLabel} {buttonIcon}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {card.discount && (
                  <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full font-bold">
                    {card.discount}
                  </span>
                )}
                {card.oldPrice && (
                  <span className="text-zinc-400 text-sm line-through">
                    {card.oldPrice}
                  </span>
                )}
                {card.price && (
                  <span className="text-white text-sm font-semibold">
                    {card.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {shopCards.map((_, idx) => (
            <span
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${
                current === idx ? "bg-white" : "bg-zinc-600"
              } transition`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: row layout, only on lg and up */}
      <div className="hidden lg:block">
        <h2 className="text-2xl font-bold text-white ml-3 mt-5">{heading}</h2>
      </div>
      <div
        className="hidden lg:flex scrollbar-hide mt-10 mx-auto snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {shopCards.map((card, idx) => (
          <div
            key={idx}
            data-card
            className="group rounded-lg flex-shrink-0 w-[310px] mx-2 flex flex-col transition hover:shadow-xl"
          >
            <div className="relative flex justify-center items-center">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                className="absolute top-3 right-3 bg-black/70 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Add to wishlist"
              >
                <FaPlus className="text-white text-lg" />
              </button>
            </div>
            <div className="py-4 flex flex-col flex-1 items-start">
              <h3 className="text-lg font-bold mb-1 text-white">
                {card.title}
              </h3>
              <p className="text-sm text-zinc-300 mb-4">{card.description}</p>
              <button type={type} href={card.link} className={buttonClass}>
                {buttonLabel} {buttonIcon}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {card.discount && (
                <span className="bg-blue-600 text-xs text-white px-2 py-0.5 rounded-full font-bold">
                  {card.discount}
                </span>
              )}
              {card.oldPrice && (
                <span className="text-zinc-400 text-sm line-through">
                  {card.oldPrice}
                </span>
              )}
              {card.price && (
                <span className="text-white text-sm font-semibold">
                  {card.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCards;
