const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // If you store games in DB
      },
      thirdpartyId: {
        type: String, // If the game is from an external store like Steam
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      // type: {
      //   type: String,
      //   required: true, // "PC", "Android", etc.
      // },
      imageUrl: {
        type: String,
      },
    },
  ],
  orderstatus: {
    type: String,
    enum: ["Processing", "Completed", "Failed"],
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
