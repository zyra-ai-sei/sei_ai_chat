import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface transaction {
    user: string,
    hash: string,
    value?: string | null,
    status?: string | null,
    token?: string | null,
    timestamp: string ,
    gas?: string ,
    gasPrice?: string,
    from?: string,
    to?: string,
    type?: string,
    input?: string |null,
    blockNumber?: string,
}

export interface TransactionDataState {
    transactions: transaction[],
}

const initialState: TransactionDataState ={
    transactions: []
}

const transactionDataSlice = createSlice({
    name: "transactionData",
    initialState,
    reducers:{
        setTransactions(
            state,
            action: PayloadAction<{response: transaction[]}>
        ){
            state.transactions =action.payload.response;
        },
        resetTransactions(
            state
        ){
            state.transactions = []
        }
    }
})

export const {setTransactions, resetTransactions} = transactionDataSlice.actions;
export default transactionDataSlice.reducer;
export {transactionDataSlice}