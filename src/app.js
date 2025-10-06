const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const pokemonRoutes = require("./routes/pokemonRoutes");

const app = express();

// ===== MIDDLEWARE CƠ BẢN =====
app.use(cors()); // cho phép FE gọi API
app.use(express.json()); // parse JSON body
app.use(morgan("dev")); // log request

// ===== STATIC FILES =====
// cho phép FE load ảnh tại /images/...
app.use("/images", express.static(path.join(__dirname, "data/images")));

// ===== ROUTES =====
app.use("/api/pokemons", pokemonRoutes);

// ===== FALLBACK =====
app.get("/", (req, res) => {
  res.send("🚀 Pokedex API running");
});

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

module.exports = app;
