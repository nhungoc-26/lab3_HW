
# AI Failure Mode Audit

## 1. Timer Drift Risk

### AI-generated approach

An AI-generated countdown could use `setInterval()` to subtract a fixed amount of time on every tick.

### Failure

`setInterval()` does not guarantee exact execution timing. Browser scheduling delays and background tab throttling can cause the countdown to drift from the actual target time.

### Fix

The `usePubgAirdropTimer` hook calculates the remaining time using an absolute timestamp:

`Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs))`

It also synchronizes the timer when the page becomes visible again through the `visibilitychange` event.

---

## 2. React State Race Condition in Claiming

### AI-generated approach

A simple claim handler could use a React state variable such as `isClaiming` to prevent users from clicking the claim button multiple times.

### Failure

React state updates are asynchronous. Multiple rapid clicks can occur before the updated state is rendered, potentially allowing duplicate claim requests.

### Fix

The `useAirdropClaim` hook uses a `useRef` lock (`claimLockRef`) to synchronously prevent another claim while a request is in progress.

The stock is also updated optimistically before the simulated server response arrives.

---

## 3. Duplicate Claim Request Risk

### AI-generated approach

A basic claim service could check whether a claim ID has already been processed and then execute the request.

### Failure

Two requests with the same claim ID could arrive concurrently before either request is recorded as processed. Without additional protection, both requests might decrement inventory.

### Fix

The `claimCrate` service uses two ES6 Maps:

- `processedClaims` stores completed claim results.
- `pendingClaims` stores in-flight promises.

Requests with the same crate ID and claim ID reuse the existing promise or completed result, ensuring that the same claim is processed only once.

---

## 4. Inventory Overselling Risk

### AI-generated approach

A simple inventory implementation could decrement stock without checking whether stock is still available.

### Failure

Concurrent claim requests could potentially reduce inventory below zero or allow more successful claims than available stock.

### Fix

The claim service checks the current server-side stock before decrementing it.

If stock is zero, it throws a `ClaimConflictError` with status `409`.

The UI handles this conflict by setting the displayed stock to zero and changing the claim status to `LOOTED_OUT`.

---

## 5. Claim Service Concurrency Tests

Three tests were implemented using Vitest.

### Test cases

1. **Prevent overselling:** Two different users attempt to claim the last available crate. Only one request succeeds, while the other receives a `409 Conflict` error.
2. **Idempotency:** Two concurrent requests with the same claim ID return the same result and decrement stock only once.
3. **Zero-stock protection:** A claim request is rejected when inventory starts at zero.

### Test result

`Test Files: 1 passed`

`Tests: 3 passed`

All three claim service tests passed.

### Limitations

The current claim service uses an in-memory simulated server with JavaScript Maps. It demonstrates concurrency handling within this application but does not provide atomic inventory protection across multiple real server instances or users connected to a production backend.
