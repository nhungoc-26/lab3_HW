
import VirtualList from "./VirtualList";
import { useMemo, useState } from "react";
import {
  initialKillFeed,
  squadFilters,
} from "../data/pubgData";

export default function KillFeed() {
  const [selectedSquad, setSelectedSquad] = useState("all");

  const filteredEvents = useMemo(() => {
    return initialKillFeed.filter((event) => {
      return (
        selectedSquad === "all" ||
        event.squadId === selectedSquad
      );
    });
  }, [selectedSquad]);

  return (
    <section className="kill-feed">
      <div className="section-heading">
        <div>
          <span className="eyebrow">BATTLEFIELD ACTIVITY</span>
          <h2>Live Kill Feed</h2>
        </div>

        <span className="live-indicator">● DEMO FEED</span>
      </div>

      <div
        className="kill-filters"
        aria-label="Filter kill feed by squad"
      >
        {squadFilters.map((squad) => (
          <button
            key={squad.id}
            type="button"
            className={
              selectedSquad === squad.id ? "active-filter" : ""
            }
            aria-pressed={selectedSquad === squad.id}
            onClick={() => setSelectedSquad(squad.id)}
          >
            {squad.label}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <VirtualList
          items={filteredEvents}
          itemHeight={76}
          height={380}
          overscan={3}
          className="kill-events"
          ariaLabel="PUBG kill feed"
          getKey={(event) => event.id}
          renderItem={(event) => (
            <article className="kill-event">
              <time>{event.time}</time>

              <div className="kill-details">
                <strong>{event.killer}</strong>
                <span className="weapon">[{event.weapon}]</span>
                <span className="kill-arrow">→</span>
                <strong>{event.victim}</strong>
              </div>
            </article>
          )}
        />
      ) : (
        <p className="empty-feed">
          No kill events for this squad.
        </p>
      )}
    </section>
  );
}
