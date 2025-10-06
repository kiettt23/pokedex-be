const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { faker } = require('@faker-js/faker');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const MAX_IMAGES = 721;

// Đường dẫn file vào/ra
const CSV_PATH = path.join(__dirname, '../data/pokemon.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/pokemons.json');

// Một số “category” & “abilities” mẫu
const defaultCategoryByType = {
  grass: 'Seed',
  fire: 'Flame',
  water: 'Sea',
  bug: 'Bug',
  normal: 'Normal',
  electric: 'Mouse',
  poison: 'Poison',
  flying: 'Bird',
  rock: 'Rock',
  ground: 'Ground',
  steel: 'Iron',
  psychic: 'Psi',
  ghost: 'Spirit',
  ice: 'Ice',
  dragon: 'Dragon',
  dark: 'Dark',
  fairy: 'Fairy',
  fighting: 'Fighting'
};

const sampleCategories = [
  'Seed','Mouse','Flame','Shellfish','Cocoon','Butterfly','Tiny Bird',
  'Poison Bee','Drill','Bat','Ball','Spike','Cat','Scratch','Lizard'
];

const sampleAbilities = [
  'Overgrow','Chlorophyll','Blaze','Solar Power','Torrent','Rain Dish','Shield Dust',
  'Run Away','Keen Eye','Tangled Feet','Intimidate','Static','Lightning Rod','Sand Veil',
  'Poison Point','Rivalry','Guts','Hustle','Thick Fat','Cute Charm','Inner Focus',
  'Infiltrator','Levitate','Swift Swim','Water Absorb','Clear Body','Rock Head','Sturdy',
  'Magnet Pull','Soundproof','Own Tempo','Synchronize','Pressure','Insomnia','Early Bird',
  'Hyper Cutter','Pickup','Technician','Vital Spirit','Scrappy','Huge Power'
];

// Tạo height/weight “hợp lý”
function randomHeightM() {
  return `${faker.number.float({ min: 0.2, max: 3.5, precision: 0.1 })} m`;
}
function randomWeightKg() {
  return `${faker.number.float({ min: 1.0, max: 400.0, precision: 0.1 })} kg`;
}

function pickCategory(types) {
  const t0 = types[0];
  return defaultCategoryByType[t0] || faker.helpers.arrayElement(sampleCategories);
}

function pickAbilities() {
  const n = faker.number.int({ min: 1, max: 2 });
  return faker.helpers.arrayElements(sampleAbilities, n);
}

function normalizeRow(row, id) {
  const name = String(row.Name || '').trim().toLowerCase();
  const type1 = (row.Type1 || '').toString().trim().toLowerCase();
  const type2 = (row.Type2 || '').toString().trim().toLowerCase();
  const types = [type1, type2].filter(Boolean);

  return {
    id,
    name,
    description: faker.lorem.sentence(),      // mô tả ngắn, gọn
    height: randomHeightM(),
    weight: randomWeightKg(),
    category: pickCategory(types),
    abilities: pickAbilities(),                // mảng 1–2 abilities
    types,
    url: `${BASE_URL}/images/${id}.png`
  };
}

(async function main() {
  console.time('seed');
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  const results = [];
  let index = 0;

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', (row) => {
      index += 1;
      if (index > MAX_IMAGES) return;                 // chỉ 721 bản ghi đầu
      results.push(normalizeRow(row, index));
    })
    .on('end', () => {
      const output = { data: results, totalPokemons: results.length };
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
      console.log(`✅ Seeded ${results.length} pokemons → ${OUTPUT_PATH}`);
      console.timeEnd('seed');
    })
    .on('error', (err) => {
      console.error('❌ CSV stream error:', err);
      process.exit(1);
    });
})();
