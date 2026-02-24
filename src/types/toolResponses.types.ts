/** Tracks whether async data (external API) has arrived in MongoDB. */
export type DataLifecycle = "pending" | "completed" | "failed";

/** Tracks the signing/broadcast lifecycle of an unsigned transaction. */
export type TxLifecycle = "unsigned" | "pending" | "completed" | "failed";

// ── Unsigned transaction (chain-agnostic) ───────────────────────────────────

export interface UnsignedTx {
  /** Target contract/recipient address */
  to: string;
  /** Hex-encoded calldata (or "0x" for native transfers) */
  data: string;
  /** Wei value as string (for native token transfers) */
  value?: string;
  /** Chain ID */
  chainId?: number;
  /** Optional gas limit hint */
  gasLimit?: string;
  /** Human-readable label (e.g. "Approve USDC", "Swap SEI→USDC") */
  label?: string;
  /** Metadata (bridge info, router address, etc.) */
  meta?: Record<string, unknown>;
}

export interface QueryToolResponse {
  kind: "query";
  executionId: string;
  toolName: string;
  requestId?: string;
  text: string;
  isError: false;
  data: string;
}

/**
 * TRANSACTION: produces unsigned transaction(s) for the user to sign.
 * Backend creates a MongoDB record (via storeAndReturnReferenceAsync)
 * so the frontend can poll/update signing status.
 *
 * Examples: transfer_sei, transfer_token, place_order, wrap_sei, bridge
 */
export interface TransactionToolResponse {
  kind: "transaction";
  executionId: string;
  toolName: string;
  requestId?: string;
  text: string;
  isError: false;
  transactions: UnsignedTx[];
  transactionStatus: TxLifecycle;
}

/**
 * ASYNC: slow external data fetch. Returns immediately with `pending`,
 * data lands in MongoDB when ready, frontend polls or uses SSE.
 *
 * Examples: get_crypto_or_token_data, twitter tools, DCA simulation
 */
export interface AsyncToolResponse {
  kind: "async";
  executionId: string;
  toolName: string;
  requestId?: string;
  text: string;
  isError: false;
  dataType: string;
  dataStatus: DataLifecycle;
}

/**
 * ERROR: any tool that fails returns this.
 * The `kind` is preserved so the frontend knows what was attempted.
 */
export interface ErrorToolResponse {
  kind: "query" | "transaction" | "async";
  executionId: string;
  toolName: string;
  requestId?: string;
  text: string;
  isError: true;
  errorCode?: string;
}

export type ToolResponse =
  | QueryToolResponse
  | TransactionToolResponse
  | AsyncToolResponse
  | ErrorToolResponse;

export function isQueryResponse(r: ToolResponse): r is QueryToolResponse {
  return r.kind === "query" && !r.isError;
}

export function isTransactionResponse(
  r: ToolResponse,
): r is TransactionToolResponse {
  return r.kind === "transaction" && !r.isError;
}

export function isAsyncResponse(r: ToolResponse): r is AsyncToolResponse {
  return r.kind === "async" && !r.isError;
}

export function isErrorResponse(r: ToolResponse): r is ErrorToolResponse {
  return r.isError === true;
}
