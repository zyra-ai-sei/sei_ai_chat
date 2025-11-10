const LeftSidebar = () => {
  return (
    <div className="w-[248px] h-full bg-[#0D0C11] border-r border-white/10 flex flex-col">
      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for Transactions"
            className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/20 font-['Figtree',sans-serif]"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          >
            <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-4">
        <button className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-['Figtree',sans-serif] hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <span className="text-lg">+</span>
          New chat
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 flex-1 overflow-auto">
        <p className="text-white/40 text-xs font-['Figtree',sans-serif] mb-2">Recent Transactions</p>
        <div className="flex flex-col gap-2">
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <p className="text-white text-sm font-['Figtree',sans-serif] mb-1">Token Transfer to 0x56562</p>
            <p className="text-white/40 text-xs font-['Figtree',sans-serif]">Transitioned 56 min ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
