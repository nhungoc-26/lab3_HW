
export interface PubgVnSquadStanding {
  readonly squadId: string;
  readonly squadName: string;
  readonly wwcdCount: number;
  readonly placementPts: number;
  readonly killPts: number;
}

export interface KillFeedEvent {
  readonly id: string;
  readonly squadId: string;
  readonly killer: string;
  readonly victim: string;
  readonly weapon: string;
  readonly time: string;
}

export const initialStandings: PubgVnSquadStanding[] = [
  {
    squadId: "te",
    squadName: "The Expendables",
    wwcdCount: 3,
    placementPts: 42,
    killPts: 38,
  },
  {
    squadId: "ces",
    squadName: "Cerberus Esports",
    wwcdCount: 2,
    placementPts: 39,
    killPts: 45,
  },
  {
    squadId: "ge",
    squadName: "Roy Esports",
    wwcdCount: 2,
    placementPts: 35,
    killPts: 32,
  },
  {
    squadId: "agg",
    squadName: "AGG",
    wwcdCount: 1,
    placementPts: 28,
    killPts: 30,
  },
];

export const initialKillFeed: KillFeedEvent[] = [
  {
    id: "kill-1",
    squadId: "te",
    killer: "TE_Player01",
    victim: "CES_Player02",
    weapon: "M416",
    time: "20:41:12",
  },
  {
    id: "kill-2",
    squadId: "ces",
    killer: "CES_Player03",
    victim: "AGG_Player01",
    weapon: "AWM",
    time: "20:40:58",
  },
  {
    id: "kill-3",
    squadId: "ge",
    killer: "ROY_Player02",
    victim: "TE_Player03",
    weapon: "Beryl M762",
    time: "20:40:31",
  },
  {
    id: "kill-4",
    squadId: "agg",
    killer: "AGG_Player02",
    victim: "CES_Player01",
    weapon: "UMP45",
    time: "20:39:45",
  },
];

export const squadFilters = [
  { id: "all", label: "All Squads" },
  { id: "te", label: "The Expendables" },
  { id: "ces", label: "Cerberus Esports" },
  { id: "ge", label: "Roy Esports" },
  { id: "agg", label: "AGG" },
];
