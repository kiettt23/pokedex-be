const express = require("express");
const router = express.Router();
const controller = require("../controllers/pokemonController");

router.get("/", controller.getAllPokemons);
router.get("/:id", controller.getPokemonById);
router.post("/", controller.createPokemon);
router.put("/:id", controller.updatePokemon);
router.delete("/:id", controller.deletePokemon);

module.exports = router;
