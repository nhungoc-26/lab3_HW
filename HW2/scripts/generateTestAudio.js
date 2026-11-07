/* global Buffer */
import fs from "node:fs";
import path from "node:path";

const sampleRate = 44100;
const duration = 2;
const frequency = 440;
const numSamples = sampleRate * duration;

const dataSize = numSamples * 2;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

for (let i = 0; i < numSamples; i++) {
  const fade = Math.min(
    1,
    i / (sampleRate * 0.05),
    (numSamples - i) / (sampleRate * 0.05)
  );

  const sample =
    Math.sin((2 * Math.PI * frequency * i) / sampleRate) *
    0.4 *
    fade;

  buffer.writeInt16LE(
    Math.round(sample * 32767),
    44 + i * 2
  );
}

const outputDir = path.join("public", "audio");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "test.wav"), buffer);

console.log("Created public/audio/test.wav");
