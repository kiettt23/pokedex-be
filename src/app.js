const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// ===== ROUTES & MIDDLEWARE =====
const pokemonRoutes = require("./routes/pokemonRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ===== GLOBAL MIDDLEWARE =====
app.use(cors()); // Cho phép FE gọi API từ domain khác
app.use(express.json()); // Parse JSON body
app.use(morgan("dev")); // Log HTTP request ngắn gọn

// ===== STATIC FILES =====
// Cho phép FE truy cập ảnh qua http://localhost:5000/images/1.png
app.use("/images", express.static(path.join(__dirname, "data/images")));

// ===== API ROUTES =====
app.use("/api/pokemons", pokemonRoutes);

// ===== ROOT ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 Pokedex API running");
});

// ===== 404 HANDLER =====
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ===== GLOBAL ERROR HANDLER =====
app.use(errorHandler);

module.exports = app;
