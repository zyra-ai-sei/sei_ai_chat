
export const EmptyState = () => (
  <div className="flex flex-col gap-3 px-6 py-12 text-center text-white/50">
    <p>No transactions found for the selected filters.</p>
    <p className="text-sm">Try syncing your wallet or adjusting the filters.</p>
  </div>
);