
import { describe, it, expect } from "vitest";
import {
  claimCrate,
  ClaimConflictError,
  initializeServerStock,
} from "./claimService";

describe("PUBG Airdrop Claim Service", () => {
  it("prevents overselling when two users claim the last crate", async () => {
    const crateId = "test-last-crate";

    initializeServerStock(crateId, 1);

    const results = await Promise.allSettled([
      claimCrate({ crateId, claimId: "user-1" }),
      claimCrate({ crateId, claimId: "user-2" }),
    ]);

    const successful = results.filter(
      (result) => result.status === "fulfilled",
    );

    const failed = results.filter(
      (result) => result.status === "rejected",
    );

    expect(successful).toHaveLength(1);
    expect(failed).toHaveLength(1);

    const failure = failed[0];

    if (failure.status === "rejected") {
      expect(failure.reason).toBeInstanceOf(ClaimConflictError);
      expect(failure.reason.status).toBe(409);
    }
  });

  it("processes duplicate claimId only once", async () => {
    const crateId = "test-idempotency";

    initializeServerStock(crateId, 5);

    const request = {
      crateId,
      claimId: "same-claim-id",
    };

    const [first, second] = await Promise.all([
      claimCrate(request),
      claimCrate(request),
    ]);

    expect(first).toEqual(second);
    expect(first.remainingStock).toBe(4);

    const next = await claimCrate({
      crateId,
      claimId: "another-claim-id",
    });

    expect(next.remainingStock).toBe(3);
  });

  it("rejects a claim when stock is zero", async () => {
    const crateId = "test-empty";

    initializeServerStock(crateId, 0);

    await expect(
      claimCrate({
        crateId,
        claimId: "empty-claim",
      }),
    ).rejects.toBeInstanceOf(ClaimConflictError);
  });
});
