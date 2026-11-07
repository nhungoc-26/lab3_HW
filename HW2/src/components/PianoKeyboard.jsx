
import { pianoNotes } from "../data/pianoNotes";
import { PianoKey } from "./PianoKey";

export function PianoKeyboard({
  pressedNotes,
  onNoteOn,
  onNoteOff,
}) {
  const whiteNotes = pianoNotes.filter((note) => !note.isBlack);
  const blackNotes = pianoNotes.filter((note) => note.isBlack);

  return (
    <div className="piano-keyboard">
      {/* 52 white keys */}
      <div className="piano-keyboard__white">
        {whiteNotes.map((note) => (
          <PianoKey
            key={note.midi}
            midi={note.midi}
            noteName={note.noteName}
            isBlack={false}
            isPressed={pressedNotes.has(note.midi)}
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        ))}
      </div>

      {/* 36 black keys */}
      <div className="piano-keyboard__black">
        {blackNotes.map((note) => {
          const whiteKeysBefore = pianoNotes.filter(
            (item) => item.midi < note.midi && !item.isBlack
          ).length;

          const leftPosition = (whiteKeysBefore / 52) * 100;

          return (
            <div
              className="piano-keyboard__black-position"
              key={note.midi}
              style={{ left: `${leftPosition}%` }}
            >
              <PianoKey
                midi={note.midi}
                noteName={note.noteName}
                isBlack={true}
                isPressed={pressedNotes.has(note.midi)}
                onNoteOn={onNoteOn}
                onNoteOff={onNoteOff}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
