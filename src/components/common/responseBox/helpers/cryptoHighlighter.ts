/**
 * Middleware function to detect and highlight crypto-related patterns
 * in text content (addresses, transaction hashes, ENS domains)
 */
export const highlightCryptoPatterns = (text: string): string => {
  if (typeof text !== "string") return text;

  // Pattern for Ethereum/Sei addresses (0x followed by 40 hex characters)
  const addressPattern = /(0x[a-fA-F0-9]{40})/g;

  // Pattern for transaction hashes (0x followed by 64 hex characters)
  const txHashPattern = /(0x[a-fA-F0-9]{64})/g;

  // Pattern for ENS domains
  const ensPattern = /([a-zA-Z0-9-]+\.eth)/g;

  // Replace addresses with highlighted version
  let highlightedText = text.replace(
    addressPattern,
    '<span class="crypto-address">$1</span>'
  );

  // Replace transaction hashes with highlighted version
  highlightedText = highlightedText.replace(
    txHashPattern,
    '<span class="crypto-txhash">$1</span>'
  );

  // Replace ENS domains with highlighted version
  highlightedText = highlightedText.replace(
    ensPattern,
    '<span class="crypto-ens">$1</span>'
  );

  return highlightedText;
};

/**
 * CSS styles for crypto pattern highlighting
 */
export const cryptoHighlightStyles = `
  .crypto-address {
      word-break: break-all;
    color: grey;
    padding: 2px 8px;
    border-radius: 6px;
    font-family: 'Monaco', monospace;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    
  }
  
  .crypto-address:hover {
    box-shadow: 0 4px 8px #FFFFFF0A;
    background: #FFFFFF0A;
  }

  .crypto-txhash {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 6px;
    font-family: 'Monaco', monospace;
    font-size: 0.85em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(245, 87, 108, 0.3);
  }

  .crypto-txhash:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(245, 87, 108, 0.4);
    background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  }

  .crypto-ens {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 6px;
    font-family: 'Monaco', monospace;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(79, 172, 254, 0.3);
  }

  .crypto-ens:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(79, 172, 254, 0.4);
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  }
`;
