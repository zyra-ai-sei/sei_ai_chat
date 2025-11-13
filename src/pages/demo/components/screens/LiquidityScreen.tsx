import { useState, useEffect } from 'react';
import type { LiquidityParams } from '../../DragonSwapDemo';
import TokenSelector from '../TokenSelector';

interface LiquidityScreenProps {
  params: LiquidityParams;
}

const LiquidityScreen = ({ params }: LiquidityScreenProps) => {
  const [tokenA, setTokenA] = useState(params.tokenA || '');
  const [tokenB, setTokenB] = useState(params.tokenB || '');
  const [amountA, setAmountA] = useState(params.amountA || '');
  const [amountB, setAmountB] = useState(params.amountB || '');

  useEffect(() => {
    setTokenA(params.tokenA || '');
    setTokenB(params.tokenB || '');
    setAmountA(params.amountA || '');
    setAmountB(params.amountB || '');
  }, [params]);

  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    // Auto-calculate amount B based on pool ratio (mock)
    if (value) {
      setAmountB((parseFloat(value) * 0.95).toFixed(2));
    } else {
      setAmountB('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button className="flex items-center gap-2 text-[#4a9fd6] hover:text-[#3aafdb] transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to pool</span>
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Manage Position</h1>
      </div>

      {/* Main Card */}
      <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-2xl overflow-hidden">
        {/* Left Section - Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr]">
          <div className="p-8 border-b lg:border-b-0 lg:border-r border-[#1a3a5c]">
            <h2 className="text-2xl font-bold text-white mb-2">Add Liquidity</h2>
            <p className="text-[#8b9cb5] text-sm mb-8">
              Deposit liquidity to the pool
            </p>

            {/* Settings Icons */}
            <div className="flex items-center justify-end gap-2 mb-6">
              <button className="text-[#8b9cb5] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <span className="text-[#8b9cb5] text-sm">0.5%</span>
              <button className="text-[#8b9cb5] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* 1. Select Pair */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">1. Select Pair</h3>
              <p className="text-[#8b9cb5] text-sm mb-4">
                Efficient for smaller trades, resulting in lower gas fees.
              </p>

              <button className="w-full bg-[#0d2642] hover:bg-[#0f2947] border border-[#1a3a5c] rounded-xl p-4 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-[#0d2642]" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 border-2 border-[#0d2642]" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold flex items-center gap-2">
                      {tokenA && tokenB ? `${tokenA}/${tokenB}` : (
                        <span className="text-[#8b9cb5]">Select token pair</span>
                      )}
                      {tokenA && tokenB && (
                        <span className="bg-[#4a9fd6] text-white text-xs px-2 py-0.5 rounded">
                          V1 0.3%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-[#8b9cb5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 2. Deposit */}
            <div>
              <h3 className="text-white font-semibold mb-3">2. Deposit</h3>
              <p className="text-[#8b9cb5] text-sm">
                V1 liquidity pools allow users to provide liquidity by depositing pairs of assets. Liquidity providers earn fees proportional to their share of the pool and can withdraw their assets at any time.
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="p-8">
            {/* First Token Input */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#8b9cb5] text-sm">Enter Amount</label>
                <div className="flex items-center gap-2">
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">50%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">75%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">MAX</button>
                </div>
              </div>
              <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={amountA}
                    onChange={(e) => handleAmountAChange(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
                  />
                  <TokenSelector selectedToken={tokenA} onSelect={setTokenA} className="ml-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">~$0.00</span>
                  <span className="text-[#4a9fd6] text-sm">Balance: 0</span>
                </div>
              </div>
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center -my-1 relative z-10">
              <div className="bg-[#0d2642] border border-[#1a3a5c] rounded-full p-2">
                <svg className="w-5 h-5 text-[#4a9fd6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>

            {/* Second Token Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#8b9cb5] text-sm">Enter Amount</label>
                <div className="flex items-center gap-2">
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">50%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">75%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">MAX</button>
                </div>
              </div>
              <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
                  />
                  <TokenSelector selectedToken={tokenB} onSelect={setTokenB} className="ml-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">~$0.00</span>
                  <span className="text-[#4a9fd6] text-sm">Balance: 1.99</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 bg-[#1a3a5c] hover:bg-[#1f4066] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <span>Approve {tokenA || 'Token'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="w-full py-4 bg-[#2a9fd6] hover:bg-[#3aafdb] text-white rounded-xl font-semibold transition-colors">
                Add Liquidity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityScreen;
