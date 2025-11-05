const ChatDemo = () => {
  return (
    <section className="bg-[#0D0C11] w-full max-w-[1440px] mx-auto py-[84px] px-[135px]">
      {/* Chat Interface Container */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Gradient blur effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#A460E4]/20 to-[#3B82F6]/20 blur-3xl rounded-3xl"></div>

        {/* Main Chat Container */}
        <div className="relative bg-[#0D0C11] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Chat Messages Area */}
          <div className="p-8 space-y-6 min-h-[400px]">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-md">
                <p className="font-['Figtree',sans-serif] text-white text-sm">
                  I want to send 50 USDC to address 0x42d3E5CbE84D03d9623ebb08cC8c8e4d on Ethereum mainnet
                </p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="bg-white/5 rounded-2xl px-6 py-4 max-w-2xl space-y-4">
                {/* AI Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A460E4] via-[#7CABF9] to-[#3B82F6] flex items-center justify-center">
                    <div className="w-5 h-3 bg-[#0D0C11]/70 rounded flex items-center justify-center gap-1">
                      <div className="w-1 h-2 bg-white rounded-full"></div>
                      <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <span className="font-['Figtree',sans-serif] text-sm font-medium text-white/80">
                    Zyra AI
                  </span>
                </div>

                {/* Building transaction text */}
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <rect x="2" y="2.67" width="12" height="10.67" rx="1.33" stroke="white" strokeWidth="1.5"/>
                  </svg>
                  <span className="font-['Figtree',sans-serif] text-sm bg-gradient-to-r from-white via-[#7CABF9] to-[#A460E4] bg-clip-text text-transparent font-medium">
                    Building transaction...
                  </span>
                </div>

                {/* Code Block */}
                <div className="bg-[#0F0E11] rounded-lg p-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">1</span>
                      <span className="text-green-600">// USDC License (solidity: GPL)</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">2</span>
                      <span className="text-green-600">// file: @openzeppelin/contracts/token/ERC20/ERC20.sol</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">3</span>
                      <span></span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">4</span>
                      <span className="text-purple-400">function transfer() ERC20</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">5</span>
                      <span className="text-white">interface ERC20 {'{'}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-white/40 select-none">6</span>
                      <span className="text-white">event Transfer(address from, address to, uint256 value)</span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-white/40 select-none">7</span>
                      <span className="font-['Figtree',sans-serif] text-sm bg-gradient-to-r from-white via-[#7CABF9] to-[#A460E4] bg-clip-text text-transparent font-medium">
                        Writing code...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-center gap-4 bg-black/50 rounded-xl px-4 py-3">
              <input
                type="text"
                placeholder="Describe your blockchain transaction..."
                className="font-['Figtree',sans-serif] flex-1 bg-transparent text-white/30 text-sm outline-none"
                disabled
              />
              <button className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 rounded-lg p-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3.33 10H16.67M16.67 10L11.67 5M16.67 10L11.67 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="font-['Figtree',sans-serif] text-xs text-white/30 text-center mt-3">
              Zyra can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatDemo;
