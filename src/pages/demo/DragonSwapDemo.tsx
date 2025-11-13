import { useState } from 'react';
import ZyraChatWidget from './components/ZyraChatWidget';
import DragonSwapUI from './components/DragonSwapUI';

export type UIScreen = 'home' | 'swap' | 'stake' | 'liquidity';

export interface SwapParams {
  fromToken?: string;
  toToken?: string;
  amount?: string;
}

export interface StakeParams {
  token?: string;
  amount?: string;
}

export interface LiquidityParams {
  tokenA?: string;
  tokenB?: string;
  amountA?: string;
  amountB?: string;
}

const DragonSwapDemo = () => {
  const [currentScreen, setCurrentScreen] = useState<UIScreen>('home');
  const [swapParams, setSwapParams] = useState<SwapParams>({});
  const [stakeParams, setStakeParams] = useState<StakeParams>({});
  const [liquidityParams, setLiquidityParams] = useState<LiquidityParams>({});

  const handleClearParams = () => {
    setSwapParams({});
    setStakeParams({});
    setLiquidityParams({});
    setCurrentScreen('home');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* DragonSwap UI */}
      <DragonSwapUI
        currentScreen={currentScreen}
        swapParams={swapParams}
        stakeParams={stakeParams}
        liquidityParams={liquidityParams}
        onClearParams={handleClearParams}
        onNavigate={setCurrentScreen}
      />

      {/* Zyra Chat Widget */}
      <ZyraChatWidget />
    </div>
  );
};

export default DragonSwapDemo;
