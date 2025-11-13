import { motion, AnimatePresence } from 'framer-motion';
import type { UIScreen, SwapParams, StakeParams, LiquidityParams } from '../DragonSwapDemo';
import SwapScreen from './screens/SwapScreen';
import StakeScreen from './screens/StakeScreen';
import LiquidityScreen from './screens/LiquidityScreen';

interface DragonSwapUIProps {
  currentScreen: UIScreen;
  swapParams: SwapParams;
  stakeParams: StakeParams;
  liquidityParams: LiquidityParams;
  onClearParams: () => void;
  onNavigate: (screen: UIScreen) => void;
}

const DragonSwapUI = ({
  currentScreen,
  swapParams,
  stakeParams,
  liquidityParams,
  onClearParams,
  onNavigate,
}: DragonSwapUIProps) => {
  return (
    <div className="w-full h-screen bg-[#0a1628] overflow-auto">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-[#0c1e35]/80 backdrop-blur-md border-b border-[#1a3a5c]">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-white">DragonSwap</h1>

          <nav className="flex items-center gap-1">
            <button 
              onClick={() => onNavigate('swap')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentScreen === 'swap' ? 'text-white bg-[#1a3a5c]/30' : 'text-[#8b9cb5] hover:text-white hover:bg-[#1a3a5c]/30'
              }`}
            >
              <span>Trade</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              onClick={() => onNavigate('liquidity')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentScreen === 'liquidity' ? 'text-white bg-[#1a3a5c]/30' : 'text-[#8b9cb5] hover:text-white hover:bg-[#1a3a5c]/30'
              }`}
            >
              <span>Explore</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              onClick={() => onNavigate('stake')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                currentScreen === 'stake' ? 'text-white bg-[#1a3a5c]/30' : 'text-[#8b9cb5] hover:text-white hover:bg-[#1a3a5c]/30'
              }`}
            >
              <span>Earn</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search for token or pool n..."
              className="w-64 px-4 py-2 pr-20 bg-[#0f2140] border border-[#1a3a5c] rounded-lg text-white text-sm placeholder:text-[#8b9cb5] focus:outline-none focus:border-[#4a9fd6]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b9cb5] text-xs">
              Ctrl + K
            </span>
          </div>

          {/* Wallet Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2a9fd6] hover:bg-[#3aafdb] rounded-lg transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
            <span className="text-white font-medium text-sm">0x40DC...B0b9</span>
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="px-8 py-4 flex items-center gap-2 text-sm">
        <span 
          className="text-[#8b9cb5] hover:text-white transition-colors cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          Home
        </span>
        <span className="text-[#8b9cb5]">/</span>
        <span className="text-white capitalize">
          {currentScreen === 'home' ? 'Trade' : currentScreen === 'swap' ? 'Trade' : currentScreen === 'liquidity' ? 'Explore' : currentScreen === 'stake' ? 'Earn' : currentScreen}
        </span>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {(currentScreen === 'home' || currentScreen === 'swap') && <SwapScreen params={swapParams} />}
            {currentScreen === 'stake' && <StakeScreen params={stakeParams} />}
            {currentScreen === 'liquidity' && <LiquidityScreen params={liquidityParams} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DragonSwapUI;
