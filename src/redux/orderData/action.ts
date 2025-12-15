import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderDataSlice } from "./reducer";
import { IRootState } from "../store";
import { axiosInstance } from "@/services/axios";

export const { setOrders, resetOrders, setLoading, addOrder } =
  orderDataSlice.actions;

export const getOrders = createAsyncThunk<
  void,
  {
    address: string,
  },
  { state: IRootState }
>("orderData/getOrders", async ( {address}, { dispatch }) => {
  try {
    dispatch(setLoading());
    const result = await axiosInstance.get(`/orders?address=${address}`);
    const apiData = result?.data;

    if (apiData?.status === 200 && apiData?.data?.data) {
      const cleanedData = apiData.data.data.map(
        ({ __v, ...rest }: any) => rest
      );
      console.log('order data', cleanedData);
      dispatch(setOrders({ response: cleanedData }));
    } else {
      dispatch(resetOrders());
    }
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    dispatch(resetOrders());
  }
});
