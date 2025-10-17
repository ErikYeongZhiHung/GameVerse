import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaStar, FaWindows, FaApple, FaLinux, FaUser, FaThumbsUp, FaThumbsDown, FaChartLine, FaUsers, FaClock, FaDownload, FaTrophy, FaGamepad, FaCalendar, FaGlobe } from "react-icons/fa";
import BuyNowPage from "./BuyNow";
import { useMutation } from "@tanstack/react-query";
import { apiConfig } from "../api/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import PaymentModal from "../components/PaymentModel";

// System Requirements Component
const SystemRequirements = ({ gameName }) => {
  const [activeTab, setActiveTab] = useState('minimum');

  // Generate system requirements based on game name
  const generateRequirements = (gameName) => {
    const isHighEnd = gameName?.toLowerCase().includes('cyberpunk') || 
                      gameName?.toLowerCase().includes('witcher') ||
                      gameName?.toLowerCase().includes('call of duty');
    
    return {
      minimum: {
        os: "Windows 10 64-bit",
        processor: isHighEnd ? "Intel Core i5-8400 / AMD Ryzen 5 2600" : "Intel Core i3-6100 / AMD FX-6300",
        memory: isHighEnd ? "8 GB RAM" : "4 GB RAM",
        graphics: isHighEnd ? "NVIDIA GTX 1060 6GB / AMD RX 580 8GB" : "NVIDIA GTX 750 Ti / AMD Radeon R7 260X",
        directX: "Version 12",
        storage: isHighEnd ? "70 GB available space" : "25 GB available space"
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: isHighEnd ? "Intel Core i7-9700K / AMD Ryzen 7 3700X" : "Intel Core i5-8400 / AMD Ryzen 5 2600",
        memory: isHighEnd ? "16 GB RAM" : "8 GB RAM",
        graphics: isHighEnd ? "NVIDIA RTX 3070 / AMD RX 6700 XT" : "NVIDIA GTX 1660 / AMD RX 580",
        directX: "Version 12",
        storage: isHighEnd ? "70 GB SSD space" : "25 GB SSD space"
      }
    };
  };

  const requirements = generateRequirements(gameName);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">System Requirements</h2>
      
      {/* Platform Icons */}
      <div className="flex gap-4 mb-6">
        <FaWindows className="text-2xl text-blue-500" title="Windows" />
        <FaApple className="text-2xl text-gray-400 opacity-50" title="Mac (Coming Soon)" />
        <FaLinux className="text-2xl text-orange-500 opacity-50" title="Linux (Coming Soon)" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('minimum')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'minimum' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Minimum
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'recommended' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Recommended
        </button>
      </div>

      {/* Requirements Content */}
      <div className="bg-[#1e1e1e] rounded-lg p-6">
        <div className="grid gap-4">
          {Object.entries(requirements[activeTab]).map(([key, value]) => (
            <div key={key} className="flex">
              <div className="w-24 text-gray-400 capitalize font-medium">{key}:</div>
              <div className="text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Statistics Analysis Component
const StatisticsAnalysis = ({ gameName, gameData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Generate statistics based on game data
  const generateStats = (gameName, gameData) => {
    const isPopular = gameName?.toLowerCase().includes('grand theft auto') || 
                      gameName?.toLowerCase().includes('witcher') ||
                      gameName?.toLowerCase().includes('cyberpunk') ||
                      gameName?.toLowerCase().includes('call of duty');
    
    const metacriticScore = gameData?.metacritic?.score || (isPopular ? 85 + Math.floor(Math.random() * 10) : 70 + Math.floor(Math.random() * 15));
    const baseUsers = isPopular ? 500000 : 50000;
    
    return {
      overview: {
        totalPlayers: baseUsers + Math.floor(Math.random() * baseUsers * 0.5),
        activeToday: Math.floor((baseUsers * 0.1) + Math.random() * (baseUsers * 0.05)),
        peakToday: Math.floor((baseUsers * 0.15) + Math.random() * (baseUsers * 0.1)),
        metacriticScore: metacriticScore,
        userScore: (metacriticScore * 0.1 - 0.5 + Math.random() * 1).toFixed(1),
        totalReviews: Math.floor(5000 + Math.random() * 15000),
        positiveReviews: Math.floor(75 + Math.random() * 20)
      },
      performance: {
        avgPlaytime: isPopular ? `${25 + Math.floor(Math.random() * 50)} hours` : `${8 + Math.floor(Math.random() * 20)} hours`,
        completionRate: `${45 + Math.floor(Math.random() * 30)}%`,
        returnPlayers: `${60 + Math.floor(Math.random() * 25)}%`,
        sessionLength: `${45 + Math.floor(Math.random() * 75)} minutes`,
        weeklyGrowth: `+${Math.floor(Math.random() * 15) + 2}%`,
        monthlyRetention: `${70 + Math.floor(Math.random() * 20)}%`
      },
      demographics: {
        regions: [
          { name: 'North America', percentage: 35 + Math.floor(Math.random() * 10), flag: '🇺🇸' },
          { name: 'Europe', percentage: 28 + Math.floor(Math.random() * 8), flag: '🇪🇺' },
          { name: 'Asia', percentage: 20 + Math.floor(Math.random() * 10), flag: '🇯🇵' },
          { name: 'Other', percentage: 12 + Math.floor(Math.random() * 5), flag: '🌍' }
        ],
        ageGroups: [
          { range: '18-24', percentage: 25 + Math.floor(Math.random() * 10) },
          { range: '25-34', percentage: 35 + Math.floor(Math.random() * 10) },
          { range: '35-44', percentage: 20 + Math.floor(Math.random() * 8) },
          { range: '45+', percentage: 15 + Math.floor(Math.random() * 5) }
        ]
      }
    };
  };

  const stats = generateStats(gameName, gameData);
  const releaseDate = gameData?.release_date?.date || '2024-01-01';
  const daysSinceRelease = Math.floor((new Date() - new Date(releaseDate)) / (1000 * 60 * 60 * 24));

  const StatCard = ({ icon: Icon, title, value, change, color = 'text-blue-400' }) => (
    <div className="bg-[#2a2a2a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`text-xl ${color}`} />
        {change && (
          <span className={`text-xs px-2 py-1 rounded ${
            change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaChartLine className="text-blue-400" />
        Statistics & Analytics
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'overview' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'performance' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('demographics')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'demographics' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Demographics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FaUsers}
              title="Total Players"
              value={stats.overview.totalPlayers.toLocaleString()}
              color="text-blue-400"
            />
            <StatCard
              icon={FaGamepad}
              title="Active Today"
              value={stats.overview.activeToday.toLocaleString()}
              change="+5.2%"
              color="text-green-400"
            />
            <StatCard
              icon={FaTrophy}
              title="Peak Today"
              value={stats.overview.peakToday.toLocaleString()}
              color="text-yellow-400"
            />
            <StatCard
              icon={FaStar}
              title="Metacritic Score"
              value={stats.overview.metacriticScore}
              color="text-purple-400"
            />
          </div>

          <div className="bg-[#1e1e1e] rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Review Summary</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {stats.overview.positiveReviews}%
                </div>
                <div className="text-sm text-gray-400">Positive Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {stats.overview.userScore}
                </div>
                <div className="text-sm text-gray-400">User Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.overview.totalReviews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={FaClock}
              title="Avg Playtime"
              value={stats.performance.avgPlaytime}
              color="text-blue-400"
            />
            <StatCard
              icon={FaTrophy}
              title="Completion Rate"
              value={stats.performance.completionRate}
              color="text-green-400"
            />
            <StatCard
              icon={FaUsers}
              title="Return Players"
              value={stats.performance.returnPlayers}
              change={stats.performance.weeklyGrowth}
              color="text-purple-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-400" />
                Engagement Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Session Length</span>
                  <span className="text-white font-semibold">{stats.performance.sessionLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Retention</span>
                  <span className="text-white font-semibold">{stats.performance.monthlyRetention}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Weekly Growth</span>
                  <span className="text-green-400 font-semibold">{stats.performance.weeklyGrowth}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCalendar className="text-green-400" />
                Release Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Days Since Release</span>
                  <span className="text-white font-semibold">{daysSinceRelease}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date</span>
                  <span className="text-white font-semibold">{new Date(releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform</span>
                  <span className="text-white font-semibold">PC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demographics Tab */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaGlobe className="text-blue-400" />
                Player Regions
              </h3>
              <div className="space-y-3">
                {stats.demographics.regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{region.flag}</span>
                      <span className="text-gray-300">{region.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {region.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-green-400" />
                Age Distribution
              </h3>
              <div className="space-y-3">
                {stats.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{group.range} years</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${group.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {group.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// User Reviews Component
const UserReviews = ({ gameName }) => {
  const [sortBy, setSortBy] = useState('helpful');

  // Generate dummy reviews based on game name
  const generateReviews = (gameName) => {
    const gameType = gameName?.toLowerCase();
    const isPopular = gameType?.includes('grand theft auto') || 
                      gameType?.includes('witcher') ||
                      gameType?.includes('cyberpunk');
    
    const reviews = [
      {
        id: 1,
        user: "GameMaster2024",
        rating: isPopular ? 5 : 4,
        playtime: "127 hours",
        date: "December 15, 2024",
        helpful: 234,
        review: isPopular 
          ? "Absolutely incredible game! The story, graphics, and gameplay are all top-notch. Highly recommended for anyone who loves open-world adventures."
          : "Great game with solid mechanics. Some minor bugs but overall a fun experience. Worth playing if you're into this genre.",
        recommended: true
      },
      {
        id: 2,
        user: "CasualGamer99",
        rating: isPopular ? 4 : 3,
        playtime: "45 hours",
        date: "December 10, 2024",
        helpful: 89,
        review: isPopular
          ? "Beautiful visuals and engaging story. Some performance issues on my system but still enjoyable. The character development is fantastic."
          : "Decent game but felt repetitive after a while. Good graphics and sound design though. Might appeal more to hardcore fans.",
        recommended: isPopular
      },
      {
        id: 3,
        user: "ProReviewer",
        rating: isPopular ? 5 : 4,
        playtime: "203 hours",
        date: "December 5, 2024",
        helpful: 456,
        review: isPopular
          ? "One of the best games I've ever played. The attention to detail is incredible. Every side quest feels meaningful and the main story is captivating."
          : "Solid gameplay mechanics and good story progression. Some technical issues need fixing but overall a good addition to the series.",
        recommended: true
      }
    ];

    return reviews;
  };

  const reviews = generateReviews(gameName);
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const recommendationPercent = Math.round((reviews.filter(r => r.recommended).length / reviews.length) * 100);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
      
      {/* Review Summary */}
      <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-400">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">{reviews.length} reviews</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{recommendationPercent}%</div>
            <div className="text-sm text-gray-400">Recommended</div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('helpful')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'helpful' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Most Helpful
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Most Recent
          </button>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#1e1e1e] rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <div>
                  <div className="font-semibold">{review.user}</div>
                  <div className="text-sm text-gray-400">{review.playtime} • {review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-sm ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {review.recommended ? (
                <div className="flex items-center gap-1 text-green-400">
                  <FaThumbsUp className="text-sm" />
                  <span className="text-sm">Recommended</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <FaThumbsDown className="text-sm" />
                  <span className="text-sm">Not Recommended</span>
                </div>
              )}
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">{review.review}</p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>Was this review helpful?</div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 hover:text-white">
                  <FaThumbsUp className="text-xs" />
                  <span>{review.helpful}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-white">
                  <FaThumbsDown className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GameDetailSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const game = location.state?.game;
  const [_showBuyNow, _setshowBuyNow] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async (cartData) => {
      const res = await apiConfig.post("/cart/create", cartData);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Added to cart:", data);
      navigate("/cart");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
    },
  });

  const rawUser = localStorage.getItem("user");
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;
  const userId = parsedUser?.id ?? parsedUser?._id ?? null;

  // ...

  const buyNowMutation = useMutation({
    mutationFn: async () => {
      const productPayload = {
        name: game.name,
        price:
          game?.price_overview?.final_formatted?.replace(/[^0-9.]/g, "") || 0,
        type: "PC",
        imageUrl: image || "",
      };

      const response = await apiConfig.post("/order/create", {
        userId,
        products: [productPayload],
        orderstatus: "Completed",
      });
      return response.data;
    },
    onSuccess: (data) => {
      // 🎉 Confetti effect
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      // ✅ Success toast
      toast.success(data.message || "Purchase Successful! 🎮", {
        icon: "🏆",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #38bdf8",
        },
      });

      // Refresh first
      // window.location.reload();

      // Navigate to homepage after 2 seconds
      // setTimeout(() => {
      //   navigate("/");
      // }, 2000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Purchase failed! ❌", {
        icon: "💥",
        style: {
          background: "#1e1b4b",
          color: "#fff",
          border: "1px solid #f87171",
        },
      });
    },
  });

  if (!game) {
    return (
      <div className="text-white p-8 text-center">
        <p className="text-lg">No game data found.</p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (_showBuyNow) {
    return <BuyNowPage game={game} />;
  }

  const image = game.header_image;

  const handleAddToCart = () => {
    if (!user) return;

    const cartData = {
      userId: user.id,
      name: game.name,
      imageUrl: image,
      rating: game?.ratings?.dejus?.rating || 0,
      description: game.short_description,
      releaseDate: game.release_date?.date || "Unknown",
      price:
        game?.price_overview?.final_formatted?.replace(/[^0-9.]/g, "") || 0,
    };

    // Only include one ID type
    if (game.productId) {
      cartData.productId = game.productId;
    } else if (game.steam_appid) {
      cartData.thirdpartyId = game.steam_appid;
    }

    addToCartMutation.mutate(cartData);
    console.log("payload ", cartData);
  };

  const handleBuyNowClick = () => {
    if (!user) return;
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = (method) => {
    setShowPaymentModal(false);

    // Pass payment method to API if needed
    buyNowMutation.mutate({
      paymentMethod: method,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 text-white">
      {/* Title & Rating */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          {game.name}
        </h1>
        {game?.ratings?.dejus?.rating && (
          <div className="flex items-center gap-2 text-lg">
            <FaStar className="text-yellow-400" />
            <span className="font-semibold">{game.ratings.dejus.rating}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left - Image */}
        <div className="flex-1">
          <img
            src={image}
            alt={`${game.name} screenshot`}
            className="rounded-2xl w-full max-h-[500px] object-cover shadow-lg"
          />
        </div>

        {/* Right - Info */}
        <div className="w-full lg:w-[360px] bg-[#18181b] rounded-2xl p-6 shadow-lg">
          {game.logo && (
            <img
              src={game.logo}
              alt={`${game.name} Logo`}
              className="h-16 mb-6 object-contain mx-auto"
            />
          )}

          <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium inline-block mb-4">
            Base Game
          </span>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {game?.price_overview?.initial && (
              <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium line-through mr-2">
                RM {game.price_overview.initial / 100}
              </span>
            )}
          <span className="text-white text-sm font-semibold">
              {game?.price_overview?.final_formatted ?
                game.price_overview.final_formatted.replace("$", "RM ").replace("USD", "") : "Free"}
            </span>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-3 transition flex items-center justify-center gap-2 disabled:opacity-70"
            onClick={handleBuyNowClick}
            disabled={!user || buyNowMutation.isPending}
          >
            {buyNowMutation.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Buy Now"
            )}
          </button>

          {showPaymentModal && (
            <PaymentModal
              onClose={() => setShowPaymentModal(false)}
              onConfirm={handleConfirmPayment}
            />
          )}

          <div className="relative">
            <button
              className={`w-full bg-[#232329] hover:bg-[#2e2e33] text-white font-semibold py-3 rounded-lg transition ${
                !user ? "opacity-60 cursor-not-allowed" : ""
              }`}
              onClick={handleAddToCart}
              disabled={!user || addToCartMutation.isPending}
              onMouseEnter={() => {
                if (!user) setShowTooltip(true);
              }}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {addToCartMutation.isPending ? "Adding..." : "Add To Cart"}
            </button>

            {!user && showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-10">
                Please log in to add to cart
              </div>
            )}
          </div>
        </div>
      </div>

      {game.detailed_description && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About This Game</h2>
          <div
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: game.detailed_description }}
          />
        </div>
      )}

      {/* System Requirements */}
      <SystemRequirements gameName={game.name} />

      {/* Statistics Analysis */}
      <StatisticsAnalysis gameName={game.name} gameData={game} />

      {/* User Reviews */}
      <UserReviews gameName={game.name} />
    </div>
  );
}
