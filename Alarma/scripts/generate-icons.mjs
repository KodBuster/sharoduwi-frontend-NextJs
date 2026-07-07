// Генерирует простые PNG-иконки (фиолетовый фон + жёлтый «шар»),
// чтобы работало «Добавить на главный экран» без 404.
// Запуск: node scripts/generate-icons.mjs
// Замените public/icons/*.png на ваш логотип, когда будет готов.
import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

function makePng(size) {
  const w = size, h = size;
  // RGBA-пиксели.
  const bytesPerPixel = 4;
  const rowLen = w * bytesPerPixel + 1; // +1 байт фильтра на строку
  const raw = Buffer.alloc(rowLen * h);
  const cx = w / 2, cy = h * 0.45, r = w * 0.28;

  for (let y = 0; y < h; y++) {
    raw[y * rowLen] = 0; // filter = none
    for (let x = 0; x < w; x++) {
      const o = y * rowLen + 1 + x * bytesPerPixel;
      // Фон — фиолетовый градиент.
      let R = 168, G = 85, B = 247;
      const t = y / h;
      R = Math.round(255 * (1 - t) + 168 * t);
      G = Math.round(110 * (1 - t) + 85 * t);
      B = Math.round(199 * (1 - t) + 247 * t);
      // «Шар» — жёлтый круг.
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) {
        R = 255; G = 217; B = 61;
      }
      // Верёвочка шара.
      if (Math.abs(x - cx) < w * 0.006 && y > cy + r && y < cy + r + h * 0.18) {
        R = 255; G = 255; B = 255;
      }
      raw[o] = R; raw[o + 1] = G; raw[o + 2] = B; raw[o + 3] = 255;
    }
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// CRC32 для PNG-чанков.
const crcTable = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ 0xffffffff;
}

mkdirSync("public/icons", { recursive: true });
for (const s of [72, 192, 512]) {
  const name = s === 72 ? "badge-72.png" : `icon-${s}.png`;
  writeFileSync(`public/icons/${name}`, makePng(s));
  console.log("✅ public/icons/" + name);
}
