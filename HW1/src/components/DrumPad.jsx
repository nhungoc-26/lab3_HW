export function DrumPad({
  pad,
  isActive,
  onTrigger,
  onRelease,
}) {
  const handlePointerDown = () => {
    onTrigger(pad.id);
  };

  const handlePointerUp = () => {
    onRelease(pad.id);
  };

  return (
    <button
      type="button"
      className={`drum-pad ${isActive ? 'is-active' : ''}`}
      aria-label={`${pad.name} drum pad. Keyboard key ${pad.key}`}
      aria-pressed={isActive}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <span className="drum-pad__key" aria-hidden="true">
        {pad.key}
      </span>

      <span className="drum-pad__name">
        {pad.name}
      </span>
    </button>
  );
}
