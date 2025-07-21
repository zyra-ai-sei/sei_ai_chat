import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserStatsData, IUserStatsReducer } from "./interface";

const initialState: IUserStatsReducer = {
  isLoading: false,
  error: "",
  data: {} as IUserStatsData,
};

export const userStatsSlice = createSlice({
  name: "UserStatsData",
  initialState,
  reducers: {
    userStatsFetchStart: (state) => ({
      ...state,
      isLoading: true,
      error: "",
    }),
    userStatsFetchSuccess: (
      state,
      { payload }: PayloadAction<IUserStatsData>
    ) => ({ ...state, isLoading: false, data: payload }),
    userStatsFetchFail: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      isLoading: false,
      data: {} as IUserStatsData,
      error: payload,
    }),
    userStatsReset: (state) => ({
      ...state,
      isLoading: false,
      error: "",
      data: {} as IUserStatsData,
    }),
  },
});

export default userStatsSlice.reducer;
