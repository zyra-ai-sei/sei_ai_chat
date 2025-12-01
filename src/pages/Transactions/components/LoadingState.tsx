export const LoadingState = () => (
  <div className="flex flex-col gap-2 px-6 py-10 text-center text-white/50">
    <p>Fetching your on-chain history…</p>
    <span className="w-32 h-1 mx-auto rounded-full animate-pulse bg-white/20" />
  </div>
);