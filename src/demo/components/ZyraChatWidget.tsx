import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UIScreen, SwapParams, StakeParams, LiquidityParams } from '../DragonSwapDemo';
import avatarImg from '@/assets/home/avatar.png';

interface ZyraChatWidgetProps {
  onScreenChange: (screen: UIScreen) => void;
  onSwapParamsChange: (params: SwapParams) => void;
  onStakeParamsChange: (params: StakeParams) => void;
  onLiquidityParamsChange: (params: LiquidityParams) => void;
}

interface Message {
  type: 'user' | 'ai';
  content: string;
}

const ZyraChatWidget = ({
  onScreenChange,
  onSwapParamsChange,
  onStakeParamsChange,
  onLiquidityParamsChange,
}: ZyraChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const parseCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Swap command - handles multiple patterns:
    // "Swap 50 SEI for USDC", "Swap SEI with USDC", "Swap 100 USDC to DAI", "Swap DRG"
    if (lowerMessage.includes('swap')) {
      const params: SwapParams = {};

      // Pattern 1: "Swap X with Y" or "Swap X for Y" or "Swap X to Y" (with optional amount)
      const swapPattern1 = message.match(/swap\s+(\d+(?:\.\d+)?)?\s*(\w+)\s+(?:with|for|to)\s+(\w+)/i);

      // Pattern 2: "Swap X Y" (amount + token, then destination token with for/to/with)
      const swapPattern2 = message.match(/swap\s+(\d+(?:\.\d+)?)\s+(\w+)\s+(?:for|to|with)\s+(\w+)/i);

      // Pattern 3: "Swap X" (just a single token)
      const swapPattern3 = message.match(/^swap\s+(\w+)\s*$/i);

      if (swapPattern1) {
        if (swapPattern1[1]) {
          params.amount = swapPattern1[1];
        }
        params.fromToken = swapPattern1[2].toUpperCase();
        params.toToken = swapPattern1[3].toUpperCase();
      } else if (swapPattern2) {
        params.amount = swapPattern2[1];
        params.fromToken = swapPattern2[2].toUpperCase();
        params.toToken = swapPattern2[3].toUpperCase();
      } else if (swapPattern3) {
        params.fromToken = swapPattern3[1].toUpperCase();
      }

      onSwapParamsChange(params);
      onScreenChange('swap');

      return `Opening Swap interface${params.amount ? ` to swap ${params.amount}` : ''}${params.fromToken ? ` ${params.fromToken}` : ''}${params.toToken ? ` for ${params.toToken}` : ''}. Please review and confirm the transaction.`;
    }

    // Stake command
    if (lowerMessage.includes('stake')) {
      const amountMatch = message.match(/(\d+(?:\.\d+)?)\s*(\w+)/i);

      const params: StakeParams = {};
      if (amountMatch) {
        params.amount = amountMatch[1];
        params.token = amountMatch[2].toUpperCase();
      } else if (lowerMessage.includes('drg')) {
        params.token = 'DRG';
      }

      onStakeParamsChange(params);
      onScreenChange('stake');

      return `Opening Staking interface${params.token ? ` for ${params.token}` : ''}. You can stake your tokens to earn rewards.`;
    }

    // Add liquidity command
    if (lowerMessage.includes('liquidity') || lowerMessage.includes('add liquidity')) {
      const poolMatch = message.match(/(\w+)[\/-](\w+)/i);

      const params: LiquidityParams = {};
      if (poolMatch) {
        params.tokenA = poolMatch[1].toUpperCase();
        params.tokenB = poolMatch[2].toUpperCase();
      }

      onLiquidityParamsChange(params);
      onScreenChange('liquidity');

      return `Opening Add Liquidity interface${params.tokenA && params.tokenB ? ` for ${params.tokenA}/${params.tokenB} pool` : ''}. You can add liquidity to earn trading fees.`;
    }

    return "I can help you with:\n• Swap tokens (e.g., 'Swap DRG', 'Swap SEI with USDC', or 'Swap 50 SEI for USDT')\n• Stake tokens (e.g., 'Stake DRG' or 'Stake 100 SEI')\n• Add liquidity (e.g., 'Add liquidity to SEI/USDC pool')";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = parseCommand(inputValue);
      const aiMessage: Message = {
        type: 'ai',
        content: aiResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Avatar Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full blur-[32px] opacity-60"
                   style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>

              {/* Avatar */}
              <div className="relative w-16 h-16 animate-pulse">
                <img src={avatarImg} alt="Zyra Avatar" className="w-16 h-16 object-contain relative z-10" />
              </div>
            </div>

            {/* Label */}
            <div className="bg-gradient-to-l border border-solid border-white from-[#204887] to-[#3B82F6] px-4 py-2 rounded-full shadow-lg"
                 style={{
                   boxShadow: 'inset 0px 0px 6px rgba(255, 255, 255, 0.4), inset 0px 0px 18px rgba(255, 255, 255, 0.16)'
                 }}>
              <p className="text-white text-xs font-semibold whitespace-nowrap" style={{ fontFamily: 'Figtree, sans-serif' }}>
                Try Zyra – AI Powered DeFi Assistant
              </p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-8 right-8 z-50 w-[25vw] h-[50vh] rounded-[32px]"
          >
            {/* Background Gradient Blur 1 */}
            <div className="absolute rounded-[32px] blur-[32px]"
                 style={{
                   width: 'calc(100% - 39px)',
                   height: 'calc(100% - 38px)',
                   left: '23px',
                   top: '18px',
                   background: 'linear-gradient(251.88deg, #8D38DD 0.56%, #3B82F6 99.58%)',
                   backgroundBlendMode: 'plus-lighter'
                 }}></div>

            {/* Background Gradient Blur 2 */}
            <div className="absolute rounded-[32px] blur-[8px]"
                 style={{
                   width: 'calc(100% - 40px)',
                   height: 'calc(100% - 38px)',
                   left: '23px',
                   top: '18px',
                   background: 'linear-gradient(109.23deg, #3B82F6 3.91%, #8D38DD 96.01%)',
                   backgroundBlendMode: 'plus-lighter'
                 }}></div>

            {/* Main Chat Container */}
            <div className="absolute w-full h-full left-0 top-0 rounded-[24px] flex flex-col"
                 style={{
                   background: 'linear-gradient(#0D0C11, #0D0C11) padding-box, linear-gradient(to bottom, #7CABF9, #B37AE8) border-box',
                   border: '1px solid transparent',
                   boxShadow: '0px 0px 16px rgba(124, 171, 249, 0.32)'
                 }}>

              {/* Chat History Section */}
              <div className="w-full flex-1 flex flex-col justify-end items-center px-4 rounded-[24px] pt-6 pb-4 gap-4 bg-white/[0.02] border-l border-white/[0.08] relative overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex flex-col items-start gap-4 w-full">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
                      <div className="relative w-[120px] h-[120px]">
                        <div className="absolute inset-0 rounded-full blur-[24px] opacity-60"
                             style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                        <div className="relative w-[120px] h-[120px] flex items-center justify-center animate-pulse">
                          <img src={avatarImg} alt="Zyra Avatar" className="w-[120px] h-[120px] object-contain relative z-10" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} gap-2 w-full`}
                        >
                          {message.type === 'user' ? (
                            <div className="flex flex-row justify-center items-center p-3 gap-2 max-w-[300px] bg-white/[0.04] border border-white/[0.08] rounded-xl">
                              <p className="text-xs leading-4 font-normal text-white whitespace-pre-line" style={{ fontFamily: 'Figtree, sans-serif' }}>
                                {message.content}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center items-start p-3 gap-3 w-full bg-white/[0.04] border-2 border-[#7CABF9] rounded-xl">
                              {/* Avatar */}
                              <div className="relative w-6 h-6">
                                <div className="absolute w-6 h-6 left-0 top-0 rounded-full blur-[4px]"
                                     style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                                <div className="absolute w-6 h-6 left-0 top-0 rounded-full"
                                     style={{
                                       background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)',
                                       boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)'
                                     }}>
                                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[12px] bg-[#0D0C11]/70 rounded px-0.5 flex items-center justify-center gap-1.5"
                                       style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.55)' }}>
                                    <div className="w-1 h-2 bg-white rounded-full"></div>
                                    <div className="w-1 h-2 bg-white rounded-full"></div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs leading-4 font-normal text-white whitespace-pre-line" style={{ fontFamily: 'Figtree, sans-serif' }}>
                                {message.content}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex flex-col justify-center items-start p-3 gap-3 bg-white/[0.04] border-2 border-[#7CABF9] rounded-xl">
                            <div className="relative w-6 h-6">
                              <div className="absolute w-6 h-6 left-0 top-0 rounded-full blur-[4px]"
                                   style={{ background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)' }}></div>
                              <div className="absolute w-6 h-6 left-0 top-0 rounded-full"
                                   style={{
                                     background: 'linear-gradient(224.32deg, #FFFFFF 38.02%, #A1D9F7 94.78%)',
                                     boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.6)'
                                   }}>
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[12px] bg-[#0D0C11]/70 rounded px-0.5 flex items-center justify-center gap-1.5"
                                     style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.55)' }}>
                                  <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
                                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs leading-4 font-normal"
                                  style={{
                                    fontFamily: 'Figtree, sans-serif',
                                    background: 'linear-gradient(90deg, #FFFFFF 0%, #7CABF9 43.27%, #8D38DD 64.42%, #FFFFFF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  }}>
                              Processing...
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bottom Input Section */}
              <div className="w-full flex flex-col items-start p-4 gap-2 rounded-[24px] bg-white/[0.08]">
                {/* Input Container */}
                <div className="flex flex-row justify-between items-end px-3 py-2 w-full h-14 bg-black/[0.54] rounded-xl"
                     style={{ backdropFilter: 'blur(2px)' }}>
                  <div className="flex-1 h-full flex items-center">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your blockchain transaction..."
                      className="w-full bg-transparent text-white text-xs leading-4 font-medium outline-none placeholder:text-white/30"
                      style={{ fontFamily: 'Figtree, sans-serif' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="flex justify-center items-center p-1.5 w-8 h-8 bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                      <path d="M3.33 10H16.67M16.67 10L11.67 5M16.67 10L11.67 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="w-full text-xs leading-4 font-normal text-center"
                   style={{ fontFamily: 'Figtree, sans-serif', color: 'rgba(255, 255, 255, 0.3)' }}>
                  Zyra can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZyraChatWidget;
