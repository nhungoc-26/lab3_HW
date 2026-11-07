
export interface ClaimRequest {
  crateId: string;
  claimId: string;
}

export interface ClaimResponse {
  success: boolean;
  claimId: string;
  remainingStock: number;
}

export class ClaimConflictError extends Error {
  readonly status = 409;

  constructor(message = "Looted Out") {
    super(message);
    this.name = "ClaimConflictError";
  }
}

const serverStock = new Map<string, number>();

const processedClaims = new Map<string, ClaimResponse>();

const pendingClaims = new Map<
  string,
  Promise<ClaimResponse>
>();

export function initializeServerStock(
  crateId: string,
  stock: number,
) {
  if (!serverStock.has(crateId)) {
    serverStock.set(crateId, Math.max(0, stock));
  }
}

export async function claimCrate({
  crateId,
  claimId,
}: ClaimRequest): Promise<ClaimResponse> {
  const requestKey = `${crateId}:${claimId}`;

  // Return the previous result for an already processed request.
  const previousResult = processedClaims.get(requestKey);

  if (previousResult) {
    return previousResult;
  }

  // Reuse the same promise for concurrent duplicate requests.
  const pendingRequest = pendingClaims.get(requestKey);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = (async () => {
    await new Promise<void>((resolve) => {
  setTimeout(resolve, 500);
});

    const currentStock = serverStock.get(crateId) ?? 0;

    if (currentStock <= 0) {
      throw new ClaimConflictError();
    }

    const remainingStock = currentStock - 1;

    serverStock.set(crateId, remainingStock);

    const response: ClaimResponse = {
      success: true,
      claimId,
      remainingStock,
    };

    processedClaims.set(requestKey, response);

    return response;
  })();

  pendingClaims.set(requestKey, request);

  try {
    return await request;
  } finally {
    pendingClaims.delete(requestKey);
  }
}
