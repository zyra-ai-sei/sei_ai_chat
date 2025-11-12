# DragonSwap x Zyra SDK Demo

This is a functional demo showcasing how the Zyra AI assistant would integrate into DragonSwap's decentralized exchange interface.

## Overview

The demo includes:
- **Zyra Chat Widget**: A floating AI assistant button that opens a chat interface
- **DragonSwap UI**: A mockup of DragonSwap with Swap, Stake, and Add Liquidity features
- **Natural Language Processing**: Chat commands that automatically navigate and prefill forms

## Features

### 1. Floating Zyra Avatar
- Located in the bottom-right corner
- Pulsing animation with gradient styling
- "Try Zyra – AI Powered DeFi Assistant" label
- Smooth hover and click animations

### 2. Chat Interface
- 25% screen width, 50% screen height
- Zyra branding with cyan/blue gradient theme
- Message history with user and AI responses
- Typing indicator animation
- Smooth slide-in/slide-out transitions

### 3. Supported Commands

#### Swap Tokens
```
Examples:
- "Swap 50 SEI for USDC"
- "Swap tokens"
- "Exchange 100 DRG to SEI"
```
Opens the Swap screen with prefilled amounts and tokens (if specified).

#### Stake Tokens
```
Examples:
- "Stake DRG"
- "Stake 500 DRG"
- "Stake tokens"
```
Opens the Staking screen with token and amount prefilled (if specified).

#### Add Liquidity
```
Examples:
- "Add liquidity to SEI/USDC pool"
- "Add liquidity"
- "Provide liquidity to DRG-USDC"
```
Opens the Add Liquidity screen with token pair prefilled (if specified).

### 4. DragonSwap Screens

#### Home Screen
- Platform overview
- Stats: TVL, 24h Volume, Total Users
- Feature cards for Swap, Stake, and Add Liquidity
- Info banner promoting Zyra AI

#### Swap Screen
- Token input/output fields
- Balance display
- Token selection dropdowns
- Exchange rate and price impact
- Network fee estimation
- Swap confirmation button

#### Stake Screen
- Token selection
- Amount input with MAX button
- Lock duration options (30, 90, 180 days)
- APY display (15%, 20%, 25%)
- Estimated rewards calculator
- Platform staking stats

#### Liquidity Screen
- Dual token input fields
- Pool ratio calculation
- Share of pool percentage
- LP token calculation
- Expected returns (APR from fees + rewards)
- Liquidity provider fee info

## Design Elements

### Zyra Styling
- Background: `#121117`, `#0D0C11`
- Secondary: `#201F24`
- Accent: Cyan (`#40DEFF`) to Blue gradient
- Font: Light weight, 14px base
- Rounded corners: `rounded-xl`, `rounded-2xl`

### DragonSwap Styling
- Background: Purple gradient (`from-purple-900 via-purple-800 to-indigo-900`)
- Accent: Purple to Pink gradient
- Glass-morphism effects with backdrop blur
- Decorative blur circles
- Border: Purple with low opacity

## Tech Stack

- **React** + **TypeScript**
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- State management with React hooks (useState)

## Component Structure

```
src/demo/
├── DragonSwapDemo.tsx          # Main demo component
├── components/
│   ├── ZyraChatWidget.tsx      # Floating chat widget
│   ├── DragonSwapUI.tsx        # Main UI wrapper
│   └── screens/
│       ├── HomeScreen.tsx      # Landing screen
│       ├── SwapScreen.tsx      # Token swap interface
│       ├── StakeScreen.tsx     # Token staking interface
│       └── LiquidityScreen.tsx # Add liquidity interface
└── README.md                   # This file
```

## How to Use

1. **Start the demo**: Import and render `DragonSwapDemo` component
2. **Click the Zyra avatar**: Opens the chat interface
3. **Type a command**: Use natural language like "Swap 50 SEI for USDC"
4. **Watch the magic**: The UI transitions to the appropriate screen with prefilled data
5. **Try different commands**: Test swap, stake, and liquidity features

## Integration with Router

To add this demo to your app, update your router:

```tsx
import DragonSwapDemo from './demo/DragonSwapDemo';

// In your router configuration:
{
  path: '/demo',
  element: <DragonSwapDemo />
}
```

Or update your main App component:

```tsx
import DragonSwapDemo from './demo/DragonSwapDemo';

function App() {
  return <DragonSwapDemo />;
}
```

## Recording a Demo Video

For best results when recording:
1. Start on the home screen
2. Show the Zyra avatar pulsing in the bottom-right
3. Click to open the chat
4. Type: "Swap 50 SEI for USDC"
5. Show the transition to Swap screen with prefilled values
6. Clear and try: "Stake DRG"
7. Show the Stake screen transition
8. Try: "Add liquidity to SEI/USDC pool"
9. Show the Liquidity screen with pool info

## Notes

- No real blockchain integration (frontend-only demo)
- All data is mocked (balances, prices, APYs)
- Wallet connection button is non-functional
- Focus is on UI/UX and Zyra SDK integration concept
- Animations are optimized for smooth 60fps recording

## Future Enhancements

- Real wallet connection
- Actual blockchain transactions
- More sophisticated NLP for parsing commands
- Transaction history
- Portfolio tracking
- Multi-language support
- Voice commands integration
