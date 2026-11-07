
export type DropPhase =
  | "WARMUP"
  | "AIRDROP_LIVE"
  | "LOOTED_OUT"
  | "EXPIRED";

export interface PubgCrateDrop {
  readonly id: string;
  readonly title: string;
  readonly priceVnd: number;
  readonly remainingStock: number;
  readonly dropEpochMs: number;
  readonly expiresAtEpochMs: number;
}

export const initialCrateDrops: PubgCrateDrop[] = [
  {
    id: "contraband-crate",
    title: "Contraband Crate",
    priceVnd: 25000,
    remainingStock: 120,
    dropEpochMs: Date.now() + 60_000,
    expiresAtEpochMs: Date.now() + 10 * 60_000,
  },
  {
    id: "hunter-crate",
    title: "Hunter's Chest",
    priceVnd: 50000,
    remainingStock: 80,
    dropEpochMs: Date.now() + 3 * 60_000,
    expiresAtEpochMs: Date.now() + 15 * 60_000,
  },
  {
    id: "esports-crate",
    title: "PVS Championship Crate",
    priceVnd: 100000,
    remainingStock: 50,
    dropEpochMs: Date.now() + 5 * 60_000,
    expiresAtEpochMs: Date.now() + 20 * 60_000,
  },
];
