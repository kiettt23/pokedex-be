const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Tạm thời đọc dữ liệu JSON tĩnh
const dataPath = path.join(__dirname, "../data/pokemons.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const pokemons = JSON.parse(raw).data;

// GET /api/pokemons
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pokemons fetched successfully",
    data: pokemons,
  });
});

module.exports = router;
