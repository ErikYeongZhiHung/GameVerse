import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaGamepad, FaStar, FaFire, FaGhost, FaCar, FaPuzzlePiece, FaCrown, FaHeart } from 'react-icons/fa';
import { apiConfig } from '../api/api';
import { useQuery } from '@tanstack/react-query';

const GameRecommendationBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your AI Game Recommender 🎮 Choose a category below to discover amazing games!",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch games data for recommendations
  const { data: gamesData } = useQuery({
    queryKey: ['games-for-bot'],
    queryFn: async () => {
      const response = await apiConfig.get('/steam/games/limited');
      return response.data.data || [];
    },
    enabled: isOpen
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Game categories with icons
  const gameCategories = [
    {
      id: 'action',
      name: 'Action Games',
      icon: FaFire,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500',
      keywords: ['Action', 'Adventure', 'Fighting', 'Shooter']
    },
    {
      id: 'rpg',
      name: 'RPG & Fantasy',
      icon: FaCrown,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500',
      keywords: ['RPG', 'Role-Playing', 'Fantasy', 'Adventure']
    },
    {
      id: 'strategy',
      name: 'Strategy',
      icon: FaGamepad,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500',
      keywords: ['Strategy', 'Simulation', 'City Builder', 'Management']
    },
    {
      id: 'racing',
      name: 'Racing & Sports',
      icon: FaCar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500',
      keywords: ['Racing', 'Sports', 'Driving', 'Simulation']
    },
    {
      id: 'horror',
      name: 'Horror & Thriller',
      icon: FaGhost,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500',
      keywords: ['Horror', 'Thriller', 'Survival', 'Dark']
    },
    {
      id: 'indie',
      name: 'Indie & Puzzle',
      icon: FaPuzzlePiece,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500',
      keywords: ['Indie', 'Puzzle', 'Casual', 'Platformer']
    },
    {
      id: 'free',
      name: 'Free Games',
      icon: FaHeart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500',
      keywords: []
    },
    {
      id: 'popular',
      name: 'Most Popular',
      icon: FaStar,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500',
      keywords: []
    }
  ];

  // Game recommendation logic based on category
  const getGameRecommendations = (categoryId) => {
    if (!gamesData || gamesData.length === 0) {
      return [];
    }

    let recommendations = [];
    const category = gameCategories.find(cat => cat.id === categoryId);

    if (categoryId === 'free') {
      recommendations = gamesData.filter(game => 
        !game.price_overview || game.price_overview.final === 0
      ).slice(0, 3);
    }
    else if (categoryId === 'popular') {
      recommendations = gamesData
        .sort((a, b) => (b.metacritic?.score || 0) - (a.metacritic?.score || 0))
        .slice(0, 3);
    }
    else if (category && category.keywords.length > 0) {
      recommendations = gamesData.filter(game => 
        game.genres?.some(genre => 
          category.keywords.some(keyword => 
            genre.description.includes(keyword)
          )
        ) || 
        category.keywords.some(keyword =>
          game.name.toLowerCase().includes(keyword.toLowerCase()) ||
          game.short_description?.toLowerCase().includes(keyword.toLowerCase())
        )
      ).slice(0, 3);
    }

    // Fallback to random games if no specific matches
    if (recommendations.length === 0) {
      recommendations = gamesData.slice(0, 3);
    }

    return recommendations;
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    const category = gameCategories.find(cat => cat.id === categoryId);
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: `Show me ${category.name}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShowCategories(false);
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const games = getGameRecommendations(categoryId);
      
      let response = `Here are 3 great ${category.name.toLowerCase()} for you:\n\n`;
      
      if (games.length > 0) {
        games.forEach((game, index) => {
          const price = game.price_overview ? 
            game.price_overview.final_formatted : 'Free';
          const rating = game.metacritic?.score || 'N/A';
          
          response += `🎮 **${game.name}**\n`;
          response += `💰 Price: ${price}\n`;
          response += `⭐ Rating: ${rating}/100\n`;
          response += `📝 ${game.short_description?.substring(0, 80)}...\n\n`;
        });
        
        response += "Want to explore another category? Choose below!";
      } else {
        response = `Sorry, I couldn't find games in ${category.name.toLowerCase()} right now. Try another category!`;
      }
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      setShowCategories(true);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-blue-600 rounded-t-lg">
            <div className="flex items-center gap-3">
              <FaRobot className="text-xl text-white" />
              <div>
                <h3 className="font-semibold text-white">AI Game Recommender</h3>
                <p className="text-xs text-blue-100">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <FaGamepad className="text-blue-400 text-sm" />
                      <span className="text-xs text-gray-400">AI Recommender</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <FaGamepad className="text-blue-400 text-sm" />
                    <span className="text-xs text-gray-400">AI is thinking</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Game Categories - Compact Layout */}
          {showCategories && (
            <div className="p-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2 text-center">
                Choose a category:
              </p>
              <div className="grid grid-cols-4 gap-1">
                {gameCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      disabled={isTyping}
                      className={`
                        flex flex-col items-center gap-1 p-2 rounded border transition-all
                        ${category.bgColor} ${category.borderColor} hover:scale-105
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <IconComponent className={`text-sm ${category.color}`} />
                      <span className="text-[10px] text-white font-medium text-center leading-tight">
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GameRecommendationBot;