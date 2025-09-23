import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenList as initialList } from "@/constants/token";
import { getLocalStorageData, setLocalStorageData } from "@/hooks/useLocalStorage";
import { LocalStorageIdEnum } from "@/enum/utility.enum";
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
  divisor: BigInt;
  imageUrl: string;
}

export interface TokenListState {
    list: Token[],
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
const initialState: TokenListState = {
    list:[...initialList, ...customTokenList]
}



export const tokenDataSlice = createSlice({
    name:"TokenData",
    initialState,
    reducers: {
        addToken(
            state,
            action: PayloadAction<Token>
        ) {
            const exists = state.list.some(
                (token)=>(
                    token.address == action.payload.address &&
                    token.chainId == action.payload.chainId
                )
            );
            
            if(!exists){
                state.list.push(action.payload);
                // extract custom tokens from the list again
                const customTokens = state.list.filter((token) => !initialList.some((initialToken)=>(
                    initialToken.address == token.address &&
                    initialToken.chainId == token.chainId
                )) )
                saveCustomTokens(customTokens);
            }
        },
        clearCustomTokens(state) {
            state.list = [...initialList];
            saveCustomTokens([]);
        }
    }

})

export default tokenDataSlice.reducer