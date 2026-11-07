
import { memo } from "react";

// Shallow comparison: chỉ render lại khi props thay đổi.
function shallowEqual(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return prevKeys.every(
    (key) => prevProps[key] === nextProps[key]
  );
}

function PianoKeyComponent({
  midi,
  noteName,
  isBlack,
  isPressed,
  onNoteOn,
  onNoteOff,
}) {
  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onNoteOn(midi);
  };

  const handlePointerUp = () => {
    onNoteOff(midi);
  };

  const handlePointerCancel = () => {
    onNoteOff(midi);
  };

  return (
    <button
      type="button"
      className={[
        "piano-key",
        isBlack ? "piano-key--black" : "piano-key--white",
        isPressed ? "piano-key--pressed" : "",
      ].join(" ")}
      aria-label={`Play ${noteName}`}
      aria-pressed={isPressed}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerUp}
    >
      <span className="piano-key__label">{noteName}</span>
    </button>
  );
}

export const PianoKey = memo(PianoKeyComponent, shallowEqual);
