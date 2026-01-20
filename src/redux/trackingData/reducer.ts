import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchTransferHistory,
  subscribeToAddress,
  unsubscribeFromAddress,
  TokenTransfer,
  getSubscribedAddresses,
} from "./action";

interface TrackingState {
  transfers: TokenTransfer[];
  subscribedAddresses: string[]; // Keep track of what we are watching
  loading: boolean;
  error: string | null;
  subscribing: boolean;
}

const initialState: TrackingState = {
  transfers: [],
  subscribedAddresses: [],
  loading: false,
  error: null,
  subscribing: false,
};

const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    addTransfer: (state, action: PayloadAction<TokenTransfer>) => {
      // Add new transfer to the top
      state.transfers.unshift(action.payload);
    },
    setSubscribedAddresses: (state, action: PayloadAction<string[]>) => {
        state.subscribedAddresses = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch History
    builder.addCase(fetchTransferHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransferHistory.fulfilled, (state, action) => {
      state.loading = false;
      // Handle various response formats:
      // 1. Array: [t1, t2]
      // 2. Wrapped in data: { data: [t1, t2] }
      // 3. Wrapped in data.items: { data: { items: [t1, t2] } }
      let data = Array.isArray(action.payload) ? action.payload : action.payload?.data;
      
      if (data && !Array.isArray(data) && Array.isArray(data.items)) {
        data = data.items;
      }
      
      state.transfers = Array.isArray(data) ? data : [];
      
      // Extract unique tracked addresses from history if we don't have a separate endpoint for it
      // Ideally we should have a separate endpoint to get subscribed addresses, 
      // but for now we can infer or just rely on what the user adds in this session if the API doesn't return list
      // If the history API returns the list of transfers, we can't strictly know ALL subscribed addresses if some have no history.
      // But let's assume for now we just show history.
    });
    builder.addCase(fetchTransferHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // GetSubscribes
    builder.addCase(getSubscribedAddresses.fulfilled, (state, action) => {
      state.subscribedAddresses = action.payload
    })

    // Subscribe
    builder.addCase(subscribeToAddress.pending, (state) => {
      state.subscribing = true;
      state.error = null;
    });
    builder.addCase(subscribeToAddress.fulfilled, (state, action) => {
      state.subscribing = false;
      // Assuming we want to add the address to our local list
      // The action.meta.arg contains the address passed to the thunk
      const address = action.meta.arg;
      if (!state.subscribedAddresses.includes(address)) {
        state.subscribedAddresses.push(address);
      }
    });
    builder.addCase(subscribeToAddress.rejected, (state, action) => {
      state.subscribing = false;
      state.error = action.payload as string;
    });

    // Unsubscribe
    builder.addCase(unsubscribeFromAddress.fulfilled, (state, action) => {
      const address = action.meta.arg;
      state.subscribedAddresses = state.subscribedAddresses.filter(a => a !== address);
    });
  },
});

export const { addTransfer, setSubscribedAddresses } = trackingSlice.actions;
export default trackingSlice.reducer;

// Selectors
export const selectTransfers = (state: any) => state.trackingData.transfers;
export const selectTrackingLoading = (state: any) => state.trackingData.loading;
export const selectTrackingError = (state: any) => state.trackingData.error;
export const selectSubscribedAddresses = (state: any) => state.trackingData.subscribedAddresses;
export const selectSubscribing = (state: any) => state.trackingData.subscribing;
