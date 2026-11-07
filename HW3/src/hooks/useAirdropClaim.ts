
import { useCallback, useEffect, useRef, useState } from "react";
import {
  claimCrate,
  ClaimConflictError,
  initializeServerStock,
} from "../services/claimService";

interface UseAirdropClaimOptions {
  crateId: string;
  initialStock: number;
}

type ClaimStatus =
  | "READY"
  | "CLAIMING"
  | "CLAIMED"
  | "LOOTED_OUT"
  | "ERROR";

export function useAirdropClaim({
  crateId,
  initialStock,
}: UseAirdropClaimOptions) {
  const [stock, setStock] = useState(initialStock);
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState<ClaimStatus>(
    initialStock > 0 ? "READY" : "LOOTED_OUT",
  );

  // Lock synchronously to prevent duplicate claims.
  const claimLockRef = useRef(false);

  useEffect(() => {
    initializeServerStock(crateId, initialStock);
  }, [crateId, initialStock]);

  const handleClaim = useCallback(async () => {
    if (claimLockRef.current || stock <= 0) {
      return;
    }

    claimLockRef.current = true;
    setIsClaiming(true);
    setStatus("CLAIMING");

    const previousStock = stock;
    const claimId = crypto.randomUUID();

    // Optimistic update: decrease stock immediately.
    setStock(previousStock - 1);

    try {
      const response = await claimCrate({
        crateId,
        claimId,
      });

      // Use authoritative stock returned by the server.
      setStock(response.remainingStock);
      setStatus("CLAIMED");
    } catch (error) {
      if (error instanceof ClaimConflictError) {
        // Server confirms that the stock is sold out.
        setStock(0);
        setStatus("LOOTED_OUT");
      } else {
        // Rollback optimistic update on other errors.
        setStock(previousStock);
        setStatus("ERROR");
      }
    } finally {
      claimLockRef.current = false;
      setIsClaiming(false);
    }
  }, [crateId, stock]);

  return {
    stock,
    isClaiming,
    status,
    handleClaim,
  };
}
