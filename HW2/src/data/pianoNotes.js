
const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
];

const WHITE_NOTES = new Set([
  "C", "D", "E", "F", "G", "A", "B",
]);

// Generate all 88 piano keys, from A0 to C8.
export const pianoNotes = Array.from({ length: 88 }, (_, index) => {
  const midi = index + 21;
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) - 1;

  const note = NOTE_NAMES[noteIndex];

  return {
    midi,
    noteName: `${note}${octave}`,
    isBlack: !WHITE_NOTES.has(note),
    frequency: 440 * Math.pow(2, (midi - 69) / 12),
  };
});
