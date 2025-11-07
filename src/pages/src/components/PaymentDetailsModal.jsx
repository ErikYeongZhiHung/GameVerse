import { useState, useEffect } from "react";
import { FaCreditCard, FaLock, FaTimes, FaTrash, FaStar } from "react-icons/fa";
import { apiConfig } from "../api/api";

export default function PaymentDetailsModal({ onClose, onSubmit, paymentMethod, gameData }) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);
  const [useNewCard, setUseNewCard] = useState(true);
  const [isLoadingSavedCards, setIsLoadingSavedCards] = useState(true);

  // Get user from localStorage
  const rawUser = localStorage.getItem("user");
  const parsedUser = rawUser ? JSON.parse(rawUser) : null;
  const userId = parsedUser?.id ?? parsedUser?._id ?? null;

  // Fetch saved cards on component mount
  useEffect(() => {
    if (userId) {
      fetchSavedCards();
    }
  }, [userId]);

  const fetchSavedCards = async () => {
    try {
      setIsLoadingSavedCards(true);
      const response = await apiConfig.get(`/payment-cards/user/${userId}`);
      if (response.data.success) {
        setSavedCards(response.data.cards);
        // Auto-select default card if exists
        const defaultCard = response.data.cards.find(card => card.isDefault);
        if (defaultCard) {
          setSelectedSavedCard(defaultCard);
          setUseNewCard(false);
        }
      }
    } catch (error) {
      console.error("Error fetching saved cards:", error);
      // If no cards found or error, just continue with new card form
    } finally {
      setIsLoadingSavedCards(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (add spaces every 4 digits)
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
        .substring(0, 19);
    }

    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .substring(0, 5);
    }

    // Format CVV (max 4 digits)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumberDigits || cardNumberDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Expiry date validation
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = "Please enter valid expiry date (MM/YY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavedCardSelect = (card) => {
    setSelectedSavedCard(card);
    setUseNewCard(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);

    try {
      let paymentData;
      
      if (useNewCard) {
        // Using new card - validate first
        if (!validateForm()) {
          setIsLoading(false);
          return;
        }

        paymentData = {
          paymentMethod,
          cardDetails: {
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            cardholderName: formData.cardholderName.trim(),
          },
          gameData,
          saveCard: saveCard,
          userId: userId,
        };
      } else {
        // Using saved card
        if (!selectedSavedCard) {
          setErrors({ general: "Please select a saved card or use a new card" });
          setIsLoading(false);
          return;
        }

        // Get decrypted card details for payment
        const cardResponse = await apiConfig.post(`/payment-cards/payment/${selectedSavedCard._id}`, {
          userId: userId,
        });

        if (!cardResponse.data.success) {
          setErrors({ general: "Error retrieving card details" });
          setIsLoading(false);
          return;
        }

        paymentData = {
          paymentMethod,
          cardDetails: cardResponse.data.cardData,
          gameData,
          savedCardId: selectedSavedCard._id,
          userId: userId,
        };
      }

      await onSubmit(paymentData);
    } catch (error) {
      console.error("Payment submission error:", error);
      setErrors({ general: "Payment failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-[#18181b] rounded-xl shadow-xl p-6 w-[450px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-blue-500 text-xl" />
            <h2 className="text-xl font-bold text-white">
              {paymentMethod} Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Game Info */}
        {gameData && (
          <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
            <h3 className="text-white font-semibold mb-1">{gameData.name}</h3>
            <p className="text-gray-400 text-sm">
              Price: ${gameData.price}
            </p>
          </div>
        )}

        {/* Saved Cards Section */}
        {!isLoadingSavedCards && savedCards.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Saved Payment Methods</h3>
            <div className="space-y-3">
              {savedCards.map((card) => (
                <label
                  key={card._id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                    selectedSavedCard?._id === card._id && !useNewCard
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-600 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="cardSelection"
                      checked={selectedSavedCard?._id === card._id && !useNewCard}
                      onChange={() => handleSavedCardSelect(card)}
                      className="accent-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {card.cardNickname || `${card.cardBrand} ****${card.lastFourDigits}`}
                        </span>
                        {card.isDefault && (
                          <FaStar className="text-yellow-400 text-sm" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{card.cardholderName}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{card.cardType}</span>
                </label>
              ))}
              
              {/* Use New Card Option */}
              <label
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                  useNewCard
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name="cardSelection"
                  checked={useNewCard}
                  onChange={() => {
                    setUseNewCard(true);
                    setSelectedSavedCard(null);
                  }}
                  className="accent-blue-500"
                />
                <span className="text-white font-medium">Use New Card</span>
              </label>
            </div>
          </div>
        )}

        {/* Loading state for saved cards */}
        {isLoadingSavedCards && (
          <div className="mb-6 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm mt-2">Loading saved cards...</p>
          </div>
        )}

        {/* Error message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Form - Only show when using new card */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {useNewCard && (
            <>
              <h3 className="text-white font-semibold mb-4">Enter New Card Details</h3>
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.cardNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.cardNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.expiryDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {errors.expiryDate && (
                <p className="text-red-400 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CVV *
              </label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.cvv
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:ring-blue-500"
                }`}
              />
              {errors.cvv && (
                <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.cardholderName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.cardholderName && (
              <p className="text-red-400 text-sm mt-1">{errors.cardholderName}</p>
            )}
          </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                <FaLock className="text-blue-400 text-sm" />
                <p className="text-blue-300 text-xs">
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Save Card Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="accent-blue-500"
                />
                <label htmlFor="saveCard" className="text-gray-300 text-sm cursor-pointer">
                  Save this card for future purchases
                </label>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${gameData?.price || "0"}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}