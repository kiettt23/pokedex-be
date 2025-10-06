const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// ====== Cấu hình cơ bản ======
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const MAX_IMAGES = 721;

// Đường dẫn file vào/ra
const CSV_PATH = path.join(__dirname, "../data/pokemon.csv");
const OUTPUT_PATH = path.join(__dirname, "../data/pokemons.json");

// ====== Hàm chuẩn hóa 1 row CSV → object chuẩn FE ======
function normalizeRow(row, id) {
  const name = String(row.Name || "")
    .trim()
    .toLowerCase();

  // Type1/Type2 có thể trống → lọc và lowercase
  const type1 = (row.Type1 || "").toString().trim().toLowerCase();
  const type2 = (row.Type2 || "").toString().trim().toLowerCase();
  const types = [type1, type2].filter(Boolean);

  return {
    id,
    name,
    types,
    url: `${BASE_URL}/images/${id}.png`,
  };
}

// ====== Luồng xử lý chính ======
(async function main() {
  console.time("convert");

  // Kiểm tra file CSV tồn tại
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV not found at: ${CSV_PATH}`);
    process.exit(1);
  }

  const results = [];
  let index = 0;

  // Dùng stream để đọc CSV dung lượng lớn an toàn
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on("data", (row) => {
      index += 1;
      if (index > MAX_IMAGES) return; // chỉ lấy 1..721

      const pokemon = normalizeRow(row, index);

      // (tuỳ chọn) Nếu muốn lọc theo ảnh thật sự tồn tại:
      // if (!hasImage(index)) return;

      results.push(pokemon);
    })
    .on("end", () => {
      const output = {
        data: results,
        totalPokemons: results.length,
      };

      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf8");
      console.log(`✅ Wrote ${results.length} pokemons → ${OUTPUT_PATH}`);
      console.timeEnd("convert");
    })
    .on("error", (err) => {
      console.error("❌ CSV stream error:", err);
      process.exit(1);
    });
})();
