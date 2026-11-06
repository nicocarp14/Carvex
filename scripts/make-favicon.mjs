import sharp from "sharp";
import { writeFileSync } from "node:fs";

const INPUT = "frontend/public/logoiso.webp";
const OUTPUT = "frontend/public/favicon.png";
const SIZE = 512;
const PAD = 32; // margen transparente alrededor

const meta = await sharp(INPUT).metadata();
console.log(`Original: ${meta.width}x${meta.height} (${meta.format})`);

// Ajustar manteniendo proporción: ancho = SIZE - PAD*2
const inner = SIZE - PAD * 2;
const resized = await sharp(INPUT)
  .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
  .toBuffer();

const resizedMeta = await sharp(resized).metadata();
const left = Math.round((SIZE - resizedMeta.width) / 2);
const top = Math.round((SIZE - resizedMeta.height) / 2);

await sharp({
  create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: resized, left, top }])
  .png()
  .toFile(OUTPUT);

const out = await sharp(OUTPUT).metadata();
console.log(`Favicon: ${out.width}x${out.height} ${out.format}`);
console.log("OK");
