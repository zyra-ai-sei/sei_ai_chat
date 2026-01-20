import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokensByChain } from "@/constants/token";
import { getLocalStorageData, setLocalStorageData } from "@/hooks/useLocalStorage";
import { LocalStorageIdEnum } from "@/enum/utility.enum";
import { RootState } from "../rootreducers";

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  denom: string;
  decimals: number;
  localName: string;
  nameOnChain: string;
  native: boolean;
  imageUrl: string;
}

export interface TokenListState {
    tokensByChain: Record<number, Token[]>;
    customTokens: Token[];
}


const loadCustomTokens = (): Token[] => {
    try{
        const customTokens = getLocalStorageData(LocalStorageIdEnum.CUSTOM_TOKENS_LIST, []);
        return Array.isArray(customTokens) ? customTokens : [];

    } catch(err){
        console.error("Error loading custom tokens from localStorage:",err)
        return []
    }
}

const saveCustomTokens = (tokens: Token[]) => {
    try{
        setLocalStorageData(LocalStorageIdEnum.CUSTOM_TOKENS_LIST, tokens);
    } catch(error){
        console.error("Error saving custom tokens to localStorage:",error);
    }
}

const customTokenList = loadCustomTokens();

// Organize custom tokens by chain
const customTokensByChain: Record<number, Token[]> = {};
customTokenList.forEach(token => {
    if (!customTokensByChain[token.chainId]) {
        customTokensByChain[token.chainId] = [];
    }
    customTokensByChain[token.chainId].push(token);
});

// Merge default tokens with custom tokens
const mergeTokensByChain = (): Record<number, Token[]> => {
    const merged: Record<number, Token[]> = {};

    // Add all chains from TokensByChain
    Object.keys(TokensByChain).forEach(chainIdStr => {
        const chainId = Number(chainIdStr);
        merged[chainId] = [...TokensByChain[chainId]];
    });

    // Add custom tokens
    Object.keys(customTokensByChain).forEach(chainIdStr => {
        const chainId = Number(chainIdStr);
        if (!merged[chainId]) {
            merged[chainId] = [];
        }
        merged[chainId] = [...merged[chainId], ...customTokensByChain[chainId]];
    });

    return merged;
};

const initialState: TokenListState = {
    tokensByChain: mergeTokensByChain(),
    customTokens: customTokenList
}



export const tokenDataSlice = createSlice({
    name:"TokenData",
    initialState,
    reducers: {
        addToken(
            state,
            action: PayloadAction<Token>
        ) {
            const chainId = action.payload.chainId;

            // Initialize chain array if it doesn't exist
            if (!state.tokensByChain[chainId]) {
                state.tokensByChain[chainId] = [];
            }

            const exists = state.tokensByChain[chainId].some(
                (token)=>(
                    token.address == action.payload.address &&
                    token.chainId == action.payload.chainId
                )
            );

            if(!exists){
                state.tokensByChain[chainId].push(action.payload);
                state.customTokens.push(action.payload);
                saveCustomTokens(state.customTokens);
            }
        },
        clearCustomTokens(state) {
            state.tokensByChain = mergeTokensByChain();
            state.customTokens = [];
            saveCustomTokens([]);
        }
    }

})

// Selector factory to get tokens for a specific chain
export const selectTokensByChain = (chainId: number) => (state: RootState): Token[] => {
    return state.tokenData.tokensByChain[chainId] || [];
};

// Selector for all tokens (backward compatibility)
export const selectAllTokens = (state: RootState): Token[] => {
    return Object.values(state.tokenData.tokensByChain).flat();
};

export default tokenDataSlice.reducer