import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionDataSlice } from "./reducer";
import { IRootState } from "../store";
import { axiosInstance } from "@/services/axios";

export const { setTransactions, resetTransactions, setLoading, addTransaction } =
  transactionDataSlice.actions;

export const addTxn = createAsyncThunk<
  void,
  { txHash: string; network?: string },
  { state: IRootState }
>("transactionData/addTxn", async ({ txHash, network = "sei" }, { dispatch }) => {
  try {
    const result = await axiosInstance.get(`transactions/details?txHash=${txHash}&network=${network}`);
    const apiData = result?.data;
    if (apiData?.status === 200 && apiData?.data) {
      const cleanedData = {
        user: apiData?.data?.data?.user || "",
        hash: apiData?.data?.data?.hash || txHash,
        value: apiData?.data?.data?.value || null,
        status: apiData?.data?.data?.status || null,
        token: apiData?.data?.data?.token || null,
        timestamp: apiData?.data?.data?.timestamp || new Date().toISOString(),
        gas: apiData?.data?.data?.gas || "",
        gasPrice: apiData?.data?.data?.gasPrice || "",
        from: apiData?.data?.data?.from || "",
        to: apiData?.data?.data?.to || "",
        type: apiData?.data?.data?.type || "",
        input: apiData?.data?.data?.input || null,
        blockNumber: apiData?.data?.data?.blockNumber || "",
      };
      dispatch(addTransaction({ transaction: cleanedData }));
    }
  } catch (err) {
    console.error("Failed to fetch transaction details:", err);
  }
});

export const getTransactions = createAsyncThunk<
  void,
  void,
  { state: IRootState }
>("transactionData/getTransactions", async (_, { dispatch }) => {
  try {
    dispatch(setLoading());
    const result = await axiosInstance.get("user/transactions");
    const apiData = result?.data;

    if (apiData?.status === 200 && apiData?.data) {
  const cleanedData = apiData.data.items.map(
    ({ __v, _id,updatedAt, ...rest }: any) => rest
  );
  console.log('transaction dtaa',cleanedData)
  dispatch(setTransactions({response:cleanedData}));      
    } else {
      dispatch(resetTransactions());
    }
  } catch (err) {
    dispatch(resetTransactions());
  }
});
