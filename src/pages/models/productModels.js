const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "auth",
    required: true,
  },
  // categoryId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "category",
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  // stock: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  type: {
    type: String,
    requiired: true,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status:{
    type:String,
    enum: ["active", "inactive"],
    default:"inactive"
  }
});

module.exports = mongoose.model("Product", productSchema);
