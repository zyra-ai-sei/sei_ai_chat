import { createAsyncThunk } from "@reduxjs/toolkit";
import { transactionDataSlice } from "./reducer";
import { IRootState } from "../store";
import { axiosInstance } from "@/services/axios";

export const { setTransactions, resetTransactions, setLoading } =
  transactionDataSlice.actions;

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
  dispatch(setTransactions({response:cleanedData}));      
    } else {
      dispatch(resetTransactions());
    }
  } catch (err) {
    dispatch(resetTransactions());
  }
});
