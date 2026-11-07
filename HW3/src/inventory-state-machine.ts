export type InventoryState =
  | "AVAILABLE"
  | "RESERVED"
  | "CHECKED_OUT"
  | "EXPIRED";

export interface InventorySnapshot {
  state: InventoryState;
  stock: number;
  reservedUntil: number | null;
}

export class InventoryStateMachine {
  private state: InventoryState = "AVAILABLE";
  private stock: number;
  private reservedUntil: number | null = null;

  constructor(initialStock: number) {
    if (initialStock < 0) {
      throw new Error("Initial stock cannot be negative.");
    }

    this.stock = initialStock;
  }

  getSnapshot(): InventorySnapshot {
    return {
      state: this.state,
      stock: this.stock,
      reservedUntil: this.reservedUntil,
    };
  }

  reserve(lockDurationMs: number): boolean {
    if (this.state !== "AVAILABLE" || this.stock <= 0) {
      return false;
    }

    this.state = "RESERVED";
    this.reservedUntil = Date.now() + lockDurationMs;

    return true;
  }

  checkout(): boolean {
    if (this.state !== "RESERVED") {
      return false;
    }

    if (this.isLockExpired()) {
      this.expireReservation();
      return false;
    }

    this.stock -= 1;
    this.state = "CHECKED_OUT";
    this.reservedUntil = null;

    return true;
  }

  expireReservation(): boolean {
    if (this.state !== "RESERVED") {
      return false;
    }

    if (!this.isLockExpired()) {
      return false;
    }

    this.state = "EXPIRED";
    this.reservedUntil = null;

    return true;
  }

  releaseExpiredReservation(): boolean {
    if (this.state !== "EXPIRED") {
      return false;
    }

    this.state = "AVAILABLE";

    return true;
  }

  private isLockExpired(): boolean {
    return this.reservedUntil !== null && Date.now() >= this.reservedUntil;
  }
}
