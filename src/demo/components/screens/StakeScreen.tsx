import { useState, useEffect } from 'react';
import type { StakeParams } from '../../DragonSwapDemo';
import TokenSelector from '../TokenSelector';

interface StakeScreenProps {
  params: StakeParams;
}

const StakeScreen = ({ params }: StakeScreenProps) => {
  const [token, setToken] = useState(params.token || '');
  const [amount, setAmount] = useState(params.amount || '');
  const [activeTab, setActiveTab] = useState<'stake' | 'withdraw'>('stake');
  const [statsTab, setStatsTab] = useState<'stats' | 'rewards' | 'activity' | 'remittances'>('stats');

  useEffect(() => {
    setToken(params.token || '');
    setAmount(params.amount || '');
  }, [params]);

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Stats */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{token ? `${token} Staking` : 'Token Staking'}</h1>
          <p className="text-[#8b9cb5] text-sm">Stake your tokens to earn rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-xl p-4">
            <div className="text-[#4a9fd6] text-xs mb-2">Total DRG Staked</div>
            <div className="text-white text-2xl font-bold mb-1">15.92M</div>
            <div className="text-[#8b9cb5] text-xs">~$570.84K</div>
          </div>
          <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-xl p-4">
            <div className="text-[#4a9fd6] text-xs mb-2">Staking APR</div>
            <div className="text-white text-2xl font-bold">175.18%</div>
          </div>
          <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-xl p-4">
            <div className="text-[#4a9fd6] text-xs mb-2">Next Reward Distribution</div>
            <div className="text-white text-lg font-bold">00d 05h 28m 54s</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-xl p-1">
          <div className="flex gap-1 mb-4">
            {(['stats', 'rewards', 'activity', 'remittances'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatsTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                  statsTab === tab
                    ? 'bg-[#2a9fd6] text-white'
                    : 'text-[#8b9cb5] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* My Stats Content */}
          {statsTab === 'stats' && (
            <div className="p-4">
              <h3 className="text-white font-semibold mb-4">My Stats</h3>

              <div className="bg-[#0d2642] rounded-lg p-4 mb-4 border border-[#1a3a5c]">
                <div className="text-[#8b9cb5] text-sm mb-2">My Staked Balance</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-600" />
                  <span className="text-white text-xl font-bold">0.00</span>
                  <span className="text-[#8b9cb5]">~$0.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">APR</span>
                  <span className="text-white font-semibold">175.18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">Your pool share</span>
                  <span className="text-white font-semibold">0%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Stake Form */}
      <div className="space-y-4">
        {/* Migration Banner */}
        <div className="bg-[#0f2140] border border-[#4a9fd6] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#4a9fd6] text-white text-xs font-bold px-2 py-1 rounded">
              ⓘ Important
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-2">Migrate to V2 Staking</h4>
              <p className="text-[#8b9cb5] text-sm mb-3">
                V1 deposits are closed. $DRG emissions continue for 90 days, learn how to migrate to V2 staking once unlocked to keep earning rewards.
              </p>
              <button className="text-[#4a9fd6] hover:text-[#3aafdb] text-sm font-medium flex items-center gap-1 transition-colors">
                Go To Legacy Staking
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stake/Withdraw Tabs */}
        <div className="bg-[#0f2140] border border-[#1a3a5c] rounded-xl">
          <div className="flex border-b border-[#1a3a5c]">
            <button
              onClick={() => setActiveTab('stake')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'stake'
                  ? 'text-white border-b-2 border-[#2a9fd6]'
                  : 'text-[#8b9cb5] hover:text-white'
              }`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'withdraw'
                  ? 'text-white border-b-2 border-[#2a9fd6]'
                  : 'text-[#8b9cb5] hover:text-white'
              }`}
            >
              Withdraw
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Stake Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#8b9cb5] text-sm">Stake</label>
                <div className="flex items-center gap-2">
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">MIN</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">50%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">75%</button>
                  <button className="text-[#4a9fd6] text-xs hover:text-[#3aafdb] transition-colors">MAX</button>
                </div>
              </div>
              <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
                  />
                  <TokenSelector selectedToken={token} onSelect={setToken} className="ml-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">~$0.00</span>
                  <span className="text-[#4a9fd6] text-sm">Balance: 0.00</span>
                </div>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex justify-center">
              <div className="bg-[#0d2642] border border-[#1a3a5c] rounded-full p-2">
                <svg className="w-5 h-5 text-[#4a9fd6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            {/* Get Input */}
            <div>
              <label className="text-[#8b9cb5] text-sm mb-2 block">Get</label>
              <div className="bg-[#0d2642] rounded-xl p-4 border border-[#1a3a5c]">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={amount}
                    readOnly
                    placeholder="0"
                    className="bg-transparent text-white text-3xl font-normal outline-none w-full placeholder:text-[#4a5a6f]"
                  />
                  <button className="flex items-center gap-2 bg-[#0f2140] hover:bg-[#152947] px-3 py-2 rounded-lg border border-[#1a3a5c] transition-colors ml-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600" />
                    <span className="text-white font-medium text-sm">sDRG</span>
                    <svg className="w-4 h-4 text-[#8b9cb5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8b9cb5] text-sm">~$0.00</span>
                  <span className="text-[#4a9fd6] text-sm">Balance: 0.00</span>
                </div>
              </div>
            </div>

            {/* Stake Button */}
            <button className="w-full py-4 bg-[#2a9fd6] hover:bg-[#3aafdb] text-white rounded-xl font-semibold transition-colors">
              Stake
            </button>
          </div>
        </div>

        {/* Add to Wallet */}
        <div className="flex justify-center">
          <button className="text-[#4a9fd6] text-sm hover:text-[#3aafdb] transition-colors flex items-center gap-2">
            <span>Add</span>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600" />
            <span>sDRG to Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeScreen;
