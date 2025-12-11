import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface OrderFill {
    txHash: string;
    logIndex: number;
    taker: string;
    srcAmountIn: string;
    dstAmountOut: string;
    dstFee: string;
    timestamp: string;
    _id: string;
}

interface Order {
    _id: string;
    orderId: number;
    maker: string;
    exchange?: string;
    srcToken?: string;
    dstToken?: string;
    srcAmount?: string;
    srcBidAmount?: string;
    dstMinAmount?: string;
    deadline?: number;
    bidDelay?: number;
    fillDelay?: number;
    status: string;
    totalFilledAmount?: string;
    percentFilled?: number;
    fills?: OrderFill[];
    txHashCreated?: string;
    txHash?: string;
    filledAmount?: string;
    createdAt?: string;
    lastUpdated?: string;
}

export interface OrderDataState {
    orders: Order[];
    loading: boolean;
}

const initialState: OrderDataState = {
    orders: [],
    loading: false,
}

const orderDataSlice = createSlice({
    name: "orderData",
    initialState,
    reducers: {
        setLoading(state) {
            return {
                ...state,
                loading: true
            }
        },
        setOrders(
            state,
            action: PayloadAction<{ response: Order[] }>
        ) {
            state.orders = action.payload.response;
            state.loading = false;
        },
        resetOrders(
            state
        ) {
            state.orders = []
            state.loading = false;
        },
        addOrder(
            state,
            action: PayloadAction<{ order: Order }>
        ) {
            state.orders.unshift(action.payload.order);
            state.loading = false;
        }
    }
})

export const { setOrders, resetOrders, addOrder } = orderDataSlice.actions;
export default orderDataSlice.reducer;
export { orderDataSlice }
