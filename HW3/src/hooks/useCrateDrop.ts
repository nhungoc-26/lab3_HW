
import { useMemo } from "react";
import { usePubgAirdropTimer } from "./usePubgAirdropTimer";
import type { DropPhase, PubgCrateDrop } from "../data/crateDrops";

interface UseCrateDropOptions {
  crate: PubgCrateDrop;
  currentStock: number;
  serverOffsetMs?: number;
}

export function useCrateDrop({
  crate,
  currentStock,
  serverOffsetMs = 0,
}: UseCrateDropOptions) {
  // Countdown đến thời điểm mở bán
  const { remainingMs: dropRemainingMs } = usePubgAirdropTimer(
    crate.dropEpochMs,
    serverOffsetMs,
  );

  // Countdown đến thời điểm kết thúc đợt mở bán
  const { remainingMs: expiryRemainingMs } = usePubgAirdropTimer(
    crate.expiresAtEpochMs,
    serverOffsetMs,
  );

  const phase = useMemo<DropPhase>(() => {
    if (currentStock <= 0) return "LOOTED_OUT";

    if (expiryRemainingMs <= 0) return "EXPIRED";

    if (dropRemainingMs > 0) return "WARMUP";

    return "AIRDROP_LIVE";
  }, [currentStock, dropRemainingMs, expiryRemainingMs]);

  return {
    phase,
    remainingMs: dropRemainingMs,
    expiryRemainingMs,
    isLive: phase === "AIRDROP_LIVE",
    isExpired: phase === "EXPIRED",
    isLootedOut: phase === "LOOTED_OUT",
  };
}
