
import { useMemo, useState } from "react";
import {
  initialStandings,
  type PubgVnSquadStanding,
} from "../data/pubgData";

type SortKey = "wwcdCount" | "placementPts" | "killPts";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "wwcdCount", label: "WWCD" },
  { value: "placementPts", label: "Placement Points" },
  { value: "killPts", label: "Kill Points" },
];

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("placementPts");
  const [ascending, setAscending] = useState(false);

  const sortedStandings = useMemo(() => {
    return [...initialStandings].sort((a, b) => {
      const difference = b[sortBy] - a[sortBy];
      return ascending ? -difference : difference;
    });
  }, [sortBy, ascending]);

  const getTotalPoints = (squad: PubgVnSquadStanding) =>
    squad.placementPts + squad.killPts;

  return (
    <section className="leaderboard">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PVS CHAMPIONSHIP</span>
          <h2>Vietnam Squad Rankings</h2>
        </div>

        <span className="live-indicator">● DEMO DATA</span>
      </div>

      <div className="leaderboard-controls">
        <label htmlFor="sort-ranking">Sort by:</label>

        <select
          id="sort-ranking"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as SortKey)
          }
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setAscending((previous) => !previous)}
          aria-label={`Sort ${ascending ? "descending" : "ascending"}`}
        >
          {ascending ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="ranking-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Squad</th>
              <th scope="col">WWCD</th>
              <th scope="col">Placement</th>
              <th scope="col">Kills</th>
              <th scope="col">Total</th>
            </tr>
          </thead>

          <tbody>
            {sortedStandings.map((squad, index) => (
              <tr key={squad.squadId}>
                <td className="rank-cell">#{index + 1}</td>
                <th scope="row">{squad.squadName}</th>
                <td>{squad.wwcdCount}</td>
                <td>{squad.placementPts}</td>
                <td>{squad.killPts}</td>
                <td className="total-cell">
                  {getTotalPoints(squad)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
