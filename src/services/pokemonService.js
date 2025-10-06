const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/pokemons.json');

function readPokemons() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw).data;
}

function writePokemons(pokemons) {
  const output = { data: pokemons, totalPokemons: pokemons.length };
  fs.writeFileSync(dataPath, JSON.stringify(output, null, 2), 'utf-8');
}

// ✅ GET all with pagination + search + type filter
function getAll({ page = 1, limit = 20, search = '', type = '' }) {
  const all = readPokemons();

  let filtered = all;
  if (search) {
    const keyword = search.toLowerCase();
    filtered = filtered.filter(p => p.name.includes(keyword));
  }
  if (type) {
    const lowerType = type.toLowerCase();
    filtered = filtered.filter(p => p.types.includes(lowerType));
  }

  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  const paged = filtered.slice(start, end);

  return { data: paged, total: filtered.length };
}

// ✅ GET by ID + prev + next
function getById(id) {
  const all = readPokemons();
  const index = all.findIndex(p => p.id === Number(id));
  if (index === -1) return null;

  const current = all[index];
  const prev = all[(index - 1 + all.length) % all.length];
  const next = all[(index + 1) % all.length];

  return { pokemon: current, previousPokemon: prev, nextPokemon: next };
}

// ✅ POST new Pokémon
function createPokemon(newData) {
  const all = readPokemons();

  // validation cơ bản
  const { id, name, types, url } = newData;
  if (!id || !name || !types || !url) throw new Error('Missing required data.');
  if (types.length > 2) throw new Error('Pokémon can only have one or two types.');
  const validTypes = [
    'bug', 'dragon', 'fairy', 'fire', 'ghost', 'ground', 'normal', 'psychic',
    'steel', 'dark', 'electric', 'fighting', 'flying', 'grass', 'ice', 'poison', 'rock', 'water'
  ];
  const invalid = types.find(t => !validTypes.includes(t.toLowerCase()));
  if (invalid) throw new Error(`Pokémon's type is invalid: ${invalid}`);
  if (all.find(p => p.id === Number(id) || p.name.toLowerCase() === name.toLowerCase()))
    throw new Error('The Pokémon already exists.');

  const pokemon = { id: Number(id), name: name.toLowerCase(), types, url };
  all.push(pokemon);
  writePokemons(all);
  return pokemon;
}

// ✅ PUT update Pokémon
function updatePokemon(id, data) {
  const all = readPokemons();
  const index = all.findIndex(p => p.id === Number(id));
  if (index === -1) throw new Error('Pokémon not found.');

  all[index] = { ...all[index], ...data };
  writePokemons(all);
  return all[index];
}

// ✅ DELETE Pokémon
function deletePokemon(id) {
  const all = readPokemons();
  const newData = all.filter(p => p.id !== Number(id));
  if (newData.length === all.length) throw new Error('Pokémon not found.');

  writePokemons(newData);
  return { message: 'Pokémon deleted successfully' };
}

module.exports = {
  getAll,
  getById,
  createPokemon,
  updatePokemon,
  deletePokemon
};
