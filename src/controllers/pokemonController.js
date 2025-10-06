const pokemonService = require("../services/pokemonService");

// GET /api/pokemons
exports.getAllPokemons = (req, res, next) => {
  try {
    const { page, limit, search, type } = req.query;
    const result = pokemonService.getAll({ page, limit, search, type });
    res.json({ success: true, data: result.data, total: result.total });
  } catch (err) {
    next(err);
  }
};

// GET /api/pokemons/:id
exports.getPokemonById = (req, res, next) => {
  try {
    const result = pokemonService.getById(req.params.id);
    if (!result) return res.status(404).json({ message: "Pokémon not found" });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/pokemons
exports.createPokemon = (req, res, next) => {
  try {
    const newPokemon = pokemonService.createPokemon(req.body);
    res.status(201).json({ success: true, data: newPokemon });
  } catch (err) {
    next(err);
  }
};

// PUT /api/pokemons/:id
exports.updatePokemon = (req, res, next) => {
  try {
    const updated = pokemonService.updatePokemon(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/pokemons/:id
exports.deletePokemon = (req, res, next) => {
  try {
    const result = pokemonService.deletePokemon(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};
