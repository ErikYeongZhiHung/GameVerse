// src/gameStatsData.js

export const TopAdd = [
  {
    title: "Grand Theft Auto V Enhanced",
    image: "https://cdn1.epicgames.com/offer/b0cd075465c44f87be3b505ac04a2e46/GTAV_CHARM_Epic_FirstParty_PortraitFOB_1200x1600_R02_1200x1600-a5528b33df876e64f5dee728830c80a3?resize=1&w=360&h=480&quality=medium",
    discount: "-50%",
    oldPrice: "$29.99",
    price: "$14.99",
  },
  {
    title: "Cyberpunk 2077",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=80&q=80",
    discount: "-60%",
    oldPrice: "$59.99",
    price: "$23.99",
  },
  {
    title: "Red Dead Redemption 2",
    image: "https://cdn1.epicgames.com/offer/14a28903e3d14bd5aa3e6dbf10868126/EN_EGST_StorePortrait_1200x1600_1200x1600-a010fb65414cbbc48e055d1f6eac41b8?resize=1&w=360&h=480&quality=medium",
    discount: "-75%",
    oldPrice: "$59.99",
    price: "$14.99",
  },
  {
    title: "EA SPORTS FC™ 25 Standard...",
    image: "https://cdn1.epicgames.com/offer/b61e8ddd14e94619b7a74cf9d73f86b5/EGS_EASPORTSFC25StandardEdition_EACanada_S2_1200x1600-6e6b5c1d5d30e15b1dbdde721c6bc544?resize=1&w=360&h=480&quality=medium",
    discount: "-80%",
    oldPrice: "$69.99",
    price: "$13.99",
    tag: "Play",
  },
  {
    title: "Ready or Not",
    image: "https://cdn1.epicgames.com/offer/0c40923dd1174a768f732a3b013dcff2/EGS_TheLastofUsPartI_NaughtyDogLLC_S2_1200x1600-41d1b88814bea2ee8cb7986ec24713e0?resize=1&w=360&h=480&quality=medium",
    price: "$23.29",
    tag: "Now On Epic",
  },
];

export const topfree = [
  {
    title: "Fortnite",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
    price: "Free",
  },
  {
    title: "Sid Meier’s Civilization® VI",
    image: "https://cdn1.epicgames.com/offer/b2818b59c0bb420e9647983dfd254931/EGS_Octopus_InsomniacGamesNixxesSoftware_S2_1200x1600-5831c61378872a1fe233b295fbf3140f?resize=1&w=360&h=480&quality=medium",
    discount: "-90%",
    oldPrice: "$59.99",
    price: "$5.99",
  },
  {
    title: "Rocket League®",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
    price: "Free",
  },
  {
    title: "VALORANT",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=80&q=80",
    price: "Free",
  },
  {
    title: "Football Manager 2024",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80",
    price: "$59.99",
  },
];

export const Topdemos = [
  {
    title: "Borderlands 4",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
    date: "Available 09/12/25",
    price: "$69.99",
  },
  {
    title: "Dying Light: The Beast",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=80&q=80",
    date: "Available 09/19/25",
    price: "$44.99",
  },
  {
    title: "Tides of Annihilation",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80",
    date: "Coming Soon",
  },
  {
    title: "MONGIL: STAR DIVE",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=80&q=80",
    date: "Coming Soon",
    tag: "First Run",
  },
  {
    title: "XOCIETY",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80",
    date: "Coming Soon",
  },
];

export const sections3 = [
  { title: "Top Add-One", items: TopAdd },
  { title: "Top Free to Play", items:topfree  },
  { title: "Top Demoa", items: Topdemos, type: "upcoming" },
];