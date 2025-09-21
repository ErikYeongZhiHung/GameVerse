const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const uploudRoutes = require("./routes/uploadRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const steamRoutes = require("./routes/steam.routes");
const statsRoutes = require('./routes/stats.routes');

// const steamController = require("./controller/steam.Controller");
// const { fetchGames } = require("./controller/steam.Controller");

const cron = require("node-cron");
const { fetchGames } = require("./controller/steam.Controller");

// Run once every 24 hours (at 2:00 AM)
cron.schedule("50 19 * * *", () => {
  console.log("⏰ Running daily Steam fetch job...");
  fetchGames();
});

require("dotenv").config();
const connectDb = require("./config/db");
connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", uploudRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/steam", steamRoutes);
app.use("/api", statsRoutes);

// fetchGames();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});