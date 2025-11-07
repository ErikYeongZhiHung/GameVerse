const mongoose = require("mongoose");
const crypto = require("crypto");

// Encryption key - In production, use environment variable
const ENCRYPTION_KEY = process.env.CARD_ENCRYPTION_KEY || 'your-32-character-secret-key-here'; // 32 characters
const IV_LENGTH = 16; // For AES, this is always 16

// Encryption function
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decryption function
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const paymentCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  cardType: {
    type: String,
    enum: ["Debit Card", "Credit Card"],
    required: true,
  },
  cardholderName: {
    type: String,
    required: true,
    trim: true,
  },
  // Store encrypted card number (only last 4 digits visible)
  encryptedCardNumber: {
    type: String,
    required: true,
  },
  lastFourDigits: {
    type: String,
    required: true,
    length: 4,
  },
  // Store encrypted expiry date
  encryptedExpiryDate: {
    type: String,
    required: true,
  },
  // Store encrypted CVV
  encryptedCvv: {
    type: String,
    required: true,
  },
  // Card brand (Visa, Mastercard, etc.) - can be determined from card number
  cardBrand: {
    type: String,
    enum: ["Visa", "Mastercard", "American Express", "Discover", "Other"],
    default: "Other",
  },
  // Whether this is the default card for the user
  isDefault: {
    type: Boolean,
    default: false,
  },
  // Card nickname for easy identification
  cardNickname: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to encrypt and save card data
paymentCardSchema.methods.setCardData = function(cardNumber, expiryDate, cvv) {
  this.encryptedCardNumber = encrypt(cardNumber);
  this.encryptedExpiryDate = encrypt(expiryDate);
  this.encryptedCvv = encrypt(cvv);
  this.lastFourDigits = cardNumber.slice(-4);
  
  // Determine card brand from card number
  this.cardBrand = this.getCardBrand(cardNumber);
};

// Method to decrypt card data (use sparingly and only when necessary)
paymentCardSchema.methods.getDecryptedCardData = function() {
  return {
    cardNumber: decrypt(this.encryptedCardNumber),
    expiryDate: decrypt(this.encryptedExpiryDate),
    cvv: decrypt(this.encryptedCvv),
  };
};

// Method to get safe card info (for display)
paymentCardSchema.methods.getSafeCardInfo = function() {
  return {
    _id: this._id,
    cardType: this.cardType,
    cardholderName: this.cardholderName,
    lastFourDigits: this.lastFourDigits,
    cardBrand: this.cardBrand,
    isDefault: this.isDefault,
    cardNickname: this.cardNickname || `${this.cardBrand} ****${this.lastFourDigits}`,
    createdAt: this.createdAt,
  };
};

// Method to determine card brand
paymentCardSchema.methods.getCardBrand = function(cardNumber) {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = cardNumber.substring(0, 2);
  const firstFourDigits = cardNumber.substring(0, 4);

  if (firstDigit === '4') {
    return 'Visa';
  } else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
    return 'Mastercard';
  } else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    return 'American Express';
  } else if (firstFourDigits === '6011' || firstTwoDigits === '65') {
    return 'Discover';
  } else {
    return 'Other';
  }
};

// Index for faster queries
paymentCardSchema.index({ userId: 1 });
paymentCardSchema.index({ userId: 1, isDefault: 1 });

// Pre-save middleware to update the updatedAt field
paymentCardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to ensure only one default card per user
paymentCardSchema.statics.setAsDefault = async function(userId, cardId) {
  // Remove default from all other cards for this user
  await this.updateMany(
    { userId: userId, _id: { $ne: cardId } },
    { isDefault: false }
  );
  
  // Set the specified card as default
  await this.findByIdAndUpdate(cardId, { isDefault: true });
};

module.exports = mongoose.model("PaymentCard", paymentCardSchema);