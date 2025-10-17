// ...existing code...
import { useState } from "react";
import { FaFacebookF, FaTimes, FaYoutube, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
// ...existing code...

const footerData = [
  {
    title: "Store",
    links: [
      { label: "Home", to: "/" },
      { label: "Details", to: "/detials" },
      { label: "Cart", to: "/cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", to: "/signin" },
      { label: "Register", to: "/signup" },
      { label: "Profile", to: "/profile" },
      { label: "Upload Game", to: "/upload" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", to: "#terms" },
      { label: "Privacy policy", to: "#privacy" },
    ],
  },
];

const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Footer = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1e1e1e] text-white px-4 md:px-12 py-10">
      {/* Top Row: Store + Socials */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Store</h2>
        <div className="flex space-x-6 text-xl">
          <FaFacebookF className="hover:text-gray-400 cursor-pointer" />
          <FaTimes className="hover:text-gray-400 cursor-pointer" />
          <FaYoutube className="hover:text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Footer Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-y-10 gap-x-12 mt-10 max-w-6xl mx-auto">
        {footerData.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold mb-3 text-lg">{section.title}</h3>
            <ul className="space-y-1 text-base text-gray-300">
              {section.links.map((link) => {
                const key = link.label;
                return (
                  <li key={key} className="hover:text-white">
                    {link.to && link.to.startsWith("/") ? (
                      <Link to={link.to} className="cursor-pointer">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.to} className="cursor-pointer">
                        {link.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile View: Single-open Accordion */}
      <div className="md:hidden mt-6 space-y-4 max-w-2xl mx-auto">
        {footerData.map((section, i) => (
          <div key={section.title} className="border-b border-gray-700 pb-2">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              className="flex justify-between items-center w-full font-semibold cursor-pointer list-none text-left py-2"
            >
              <span>{section.title}</span>
              <span
                className={`text-gray-400 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              >
                &#9660;
              </span>
            </button>

            {openIndex === i && (
              <ul className="mt-2 space-y-1 text-base text-gray-300 pl-2">
                {section.links.map((link) => (
                  <li key={link.label} className="hover:text-white">
                    {link.to && link.to.startsWith("/") ? (
                      <Link to={link.to} className="cursor-pointer block py-1">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.to} className="cursor-pointer block py-1">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Legal Row */}
      <div className="bg-[#1e1e1e] text-gray-400 px-0 md:px-12 py-6 border-t border-gray-700 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-6xl mx-auto">
          <p className="text-sm max-w-4xl leading-relaxed">
            © 2025, Epic Games, Inc. All rights reserved. Epic, Epic Games, the
            Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine,
            the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament
            logo are trademarks or registered trademarks of Epic Games, Inc. in
            the United States of America and elsewhere. Other brands or product
            names are the trademarks of their respective owners. Our websites
            may contain links to other sites and resources provided by third
            parties. These links are provided for your convenience only. Epic
            Games has no control over the contents of those sites or resources,
            and accepts no responsibility for them or for any loss or damage
            that may arise from your use of them.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-[#2d2d2d] text-white px-4 py-2 rounded-md hover:bg-[#3a3a3a] transition"
          >
            Back to top <FaArrowUp />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300 max-w-6xl mx-auto">
          <a href="#terms" className="hover:underline">
            Terms of service
          </a>
          <a href="#privacy" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// ...existing code...
