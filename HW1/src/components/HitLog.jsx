export function HitLog({ hits }) {
  return (
    <section
      className="hit-log"
      aria-labelledby="hit-log-title"
    >
      <h2 id="hit-log-title">Recent Hits</h2>

      <output
        className="hit-log__output"
        aria-live="polite"
        aria-label="Drum hit history"
      >
        {hits.length === 0 ? (
          <span>No drum hits yet.</span>
        ) : (
          <ul>
            {hits.map((hit) => (
              <li key={hit.id}>
                <span>{hit.name}</span>
                <span>
                  {hit.key} · {hit.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </output>
    </section>
  );
}