import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public');
const outFile = path.join(outDir, 'patient_report.pdf');

fs.mkdirSync(outDir, { recursive: true });

const doc = await PDFDocument.create();
const page = doc.addPage([612, 792]);
const font = await doc.embedFont(StandardFonts.Helvetica);
const lines = [
  'StayHealthy Inc. — Patient report (sample)',
  '',
  'This PDF is generated for the capstone so View / Download work.',
  'Replace with your Figma export when ready.',
];
let y = 720;
lines.forEach((line, i) => {
  const size = i === 0 ? 16 : 11;
  page.drawText(line || ' ', { x: 72, y, size, font });
  y -= i === 0 ? 28 : 18;
});
const bytes = await doc.save();
fs.writeFileSync(outFile, bytes);
console.log('Wrote', outFile);
