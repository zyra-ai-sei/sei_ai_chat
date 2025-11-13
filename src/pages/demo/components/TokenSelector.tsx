import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS, getTokenBySymbol, type Token } from '../config/tokens';

interface TokenSelectorProps {
  selectedToken: string;
  onSelect: (token: string) => void;
  className?: string;
}

const TokenSelector = ({ selectedToken, onSelect, className = '' }: TokenSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const token = selectedToken ? getTokenBySymbol(selectedToken) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (selectedToken: Token) => {
    onSelect(selectedToken.symbol);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0f2140] hover:bg-[#152947] px-3 py-2 rounded-lg border border-[#1a3a5c] transition-colors"
      >
        {token && (
          <img
            src={token.icon}
            alt={token.symbol}
            className="w-5 h-5 rounded-full object-contain"
          />
        )}
        <span className={`font-medium text-sm ${selectedToken ? 'text-white' : 'text-[#8b9cb5]'}`}>
          {selectedToken || 'Select token'}
        </span>
        <svg
          className={`w-4 h-4 text-[#8b9cb5] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-[#0f2140] border border-[#1a3a5c] rounded-xl overflow-hidden shadow-xl z-50 min-w-[200px]"
          >
            <div className="max-h-[300px] overflow-y-auto">
              {TOKENS.map((tokenOption) => (
                <button
                  key={tokenOption.symbol}
                  onClick={() => handleSelect(tokenOption)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1a3a5c] transition-colors ${
                    tokenOption.symbol === selectedToken ? 'bg-[#1a3a5c]' : ''
                  }`}
                >
                  <img
                    src={tokenOption.icon}
                    alt={tokenOption.symbol}
                    className="w-6 h-6 rounded-full object-contain"
                  />
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium text-sm">{tokenOption.symbol}</div>
                    <div className="text-[#8b9cb5] text-xs">{tokenOption.name}</div>
                  </div>
                  {tokenOption.symbol === selectedToken && (
                    <svg className="w-5 h-5 text-[#4a9fd6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelector;
