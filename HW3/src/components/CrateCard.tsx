
import { useAirdropClaim } from "../hooks/useAirdropClaim";
import { useCrateDrop } from "../hooks/useCrateDrop";
import type { PubgCrateDrop } from "../data/crateDrops";

interface CrateCardProps {
  crate: PubgCrateDrop;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatVnd(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function CrateCard({ crate }: CrateCardProps) {
  const {
    stock,
    isClaiming,
    status,
    handleClaim,
  } = useAirdropClaim({
    crateId: crate.id,
    initialStock: crate.remainingStock,
  });

  const {
    phase,
    remainingMs,
    expiryRemainingMs,
  } = useCrateDrop({
    crate,
    currentStock: stock,
  });

  const canClaim = phase === "AIRDROP_LIVE" &&
    status !== "CLAIMING" &&
    status !== "CLAIMED";

  const statusLabel = {
    WARMUP: "COMING SOON",
    AIRDROP_LIVE: "AIRDROP LIVE",
    LOOTED_OUT: "LOOTED OUT",
    EXPIRED: "EXPIRED",
  }[phase];

  return (
    <article className="crate-card">
      <div className="crate-visual">
        <span className="crate-rarity">CONTRABAND DROP</span>
        <div className="crate-icon" aria-hidden="true">📦</div>
        <span className={`crate-phase ${phase.toLowerCase()}`}>
          {statusLabel}
        </span>
      </div>

      <div className="crate-information">
        <h3>{crate.title}</h3>
        <p className="crate-price">{formatVnd(crate.priceVnd)}</p>

        <div className="crate-stock">
          <span>Remaining stock</span>
          <strong>{stock}</strong>
        </div>

        <div className="crate-timer">
          {phase === "WARMUP" && (
            <>
              <span>DROP STARTS IN</span>
              <strong>{formatTime(remainingMs)}</strong>
            </>
          )}

          {phase === "AIRDROP_LIVE" && (
            <>
              <span>DROP ENDS IN</span>
              <strong>{formatTime(expiryRemainingMs)}</strong>
            </>
          )}

          {phase === "LOOTED_OUT" && (
            <strong>ALL CRATES CLAIMED</strong>
          )}

          {phase === "EXPIRED" && (
            <strong>DROP HAS ENDED</strong>
          )}
        </div>

        <button
          className="claim-button"
          type="button"
          disabled={!canClaim}
          onClick={handleClaim}
        >
          {isClaiming
            ? "CLAIMING..."
            : status === "CLAIMED"
              ? "CLAIMED"
              : phase === "WARMUP"
                ? "COMING SOON"
                : phase === "LOOTED_OUT"
                  ? "LOOTED OUT"
                  : phase === "EXPIRED"
                    ? "EXPIRED"
                    : "CLAIM CRATE"}
        </button>

        {status === "ERROR" && (
          <p role="alert" className="claim-message">
            Claim failed. Please try again.
          </p>
        )}
      </div>
    </article>
  );
}

export default CrateCard;
