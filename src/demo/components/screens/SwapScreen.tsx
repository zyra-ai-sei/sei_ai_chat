import { useState, useEffect } from 'react';
import type { SwapParams } from '../../DragonSwapDemo';
import TokenSelector from '../TokenSelector';

interface SwapScreenProps {
  params: SwapParams;
}

const SwapScreen = ({ params }: SwapScreenProps) => {
  const [fromToken, setFromToken] = useState(params.fromToken || '');
  const [toToken, setToToken] = useState(params.toToken || '');
  const [amount, setAmount] = useState(params.amount || '');
  const [toAmount, setToAmount] = useState('');

  useEffect(() => {
    setFromToken(params.fromToken || '');
    setToToken(params.toToken || '');
    setAmount(params.amount || '');

    // Mock exchange rate calculation
    if (params.amount) {
      const mockRate = 1.05;
      setToAmount((parseFloat(params.amount) * mockRate).toFixed(2));
    } else {
      setToAmount('');
    }
  }, [params]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);

    const tempAmount = amount;
    setAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="w-full max-w-[520px] mx-auto">
      {/* Swap Card */}
      <div className="bg-[#0f2140] rounded-2xl border border-[#1a3a5c] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Swap</h2>
          <div className="flex items-center gap-2">
            <button className="text-[#8b9cb5] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
        </div>

        {/* From Input */}
        <div className="mb-1">
          <label className="text-[#8b9cb5] text-sm mb-2 block">From</label>
          <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b9cb5] text-sm">~$0.00</span>
              <div className="flex items-center gap-3">
                <TokenSelector selectedToken={fromToken} onSelect={setFromToken} />
                <span className="text-[#4a9fd6] text-sm">Balance: 1.99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="bg-[#0f2140] hover:bg-[#152947] border-2 border-[#1a3a5c] rounded-xl p-2 transition-colors"
          >
            <svg className="w-5 h-5 text-[#4a9fd6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Input */}
        <div className="mb-4">
          <label className="text-[#8b9cb5] text-sm mb-2 block">To</label>
          <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b9cb5] text-sm">~$0.00</span>
              <div className="flex items-center gap-3">
                <TokenSelector selectedToken={toToken} onSelect={setToToken} />
                <span className="text-[#4a9fd6] text-sm">Balance: 0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Fee */}
        <div className="bg-[#0d2642] rounded-lg p-3 mb-4 border border-[#1a3a5c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8b9cb5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[#8b9cb5] text-sm">Network fee</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white text-sm font-medium">$0.00</span>
              <svg className="w-4 h-4 text-[#8b9cb5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button className="w-full py-4 bg-[#2a9fd6] hover:bg-[#3aafdb] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Swap
        </button>
      </div>

      {/* Add to Wallet */}
      <div className="mt-4 flex justify-center">
        <button className="text-[#4a9fd6] text-sm hover:text-[#3aafdb] transition-colors">
          Add {toToken} to Wallet
        </button>
      </div>
    </div>
  );
};

export default SwapScreen;
