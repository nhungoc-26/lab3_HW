export function DecibelMeter({ decibels }) {
  const percentage = Math.min(
    100,
    Math.max(0, ((decibels + 60) / 60) * 100)
  );

  return (
    <section
      className="decibel-meter"
      aria-labelledby="level-title"
    >
      <div className="decibel-meter__header">
        <h2 id="level-title">Master Level</h2>

        <output aria-live="polite">
          {decibels.toFixed(1)} dB
        </output>
      </div>

      <div
        className="decibel-meter__track"
        role="meter"
        aria-label="Current drum volume"
        aria-valuemin={-60}
        aria-valuemax={0}
        aria-valuenow={Number(decibels.toFixed(1))}
      >
        <span
          className="decibel-meter__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="sr-only">
        Current drum volume is {decibels.toFixed(1)} decibels.
      </p>
    </section>
  );
}
