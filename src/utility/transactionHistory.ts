export const normalizeStatus = (status?: string | null) =>
  (status?.toLowerCase().replace("status_", "") || "pending") as
    | "pending"
    | "success"
    | "failed"
    | "error";

export const formatHash = (hash?: string) =>
  hash ? `${hash.slice(0, 10)}…${hash.slice(-6)}` : "—";

export const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—";

export const formatTokenValue = (value?: number | string | null) => {
  const numeric = toSeiValue(value);
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: numeric < 1 ? 4 : 2,
  }).format(numeric);
};

export const formatTime = (timestamp?: string) =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

export const toSeiValue = (value?: number | string | null) =>
  Number(value || 0) / 10 ** 18;