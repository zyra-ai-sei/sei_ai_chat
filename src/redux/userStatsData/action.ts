import { createAsyncThunk } from "@reduxjs/toolkit";

import { IRootState } from "../../store";

import { axiosInstance } from "@/services/axios";
import { userStatsSlice } from "./reducer";
import { IUserStatsData } from "./interface";

export const {
  userStatsFetchFail,
  userStatsFetchStart,
  userStatsFetchSuccess,
  userStatsReset,
} = userStatsSlice.actions;

interface UserStatsOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
  userId: string;
  isSWMode?: boolean;
}

export const fetchUserStats = createAsyncThunk<
  void,
  UserStatsOptions,
  { state: IRootState }
>(
  "chaquenPointsData",
  async ({ onFailureCb, onSuccessCb, userId, isSWMode }, { dispatch }) => {
    try {
      dispatch(userStatsFetchStart());
      const response = await axiosInstance.get(
        isSWMode
          ? `/users/${userId}/stats?isSWMode=${isSWMode}`
          : `/users/${userId}/stats`
      );
      const data = response?.data?.data as IUserStatsData;

      const chaquenPointsData = data?.chaquenPoints as {
        balance: string;
        claimableBalance: string;
      };
      const totalBalance =
        (Number(chaquenPointsData?.balance) +
          Number(chaquenPointsData?.claimableBalance)) /
        1e18;

      if (data) {
        dispatch(
          userStatsFetchSuccess({
            ...data,
            chaquenPoints: {
              balance: data.chaquenPoints.balance,
              claimableBalance: data.chaquenPoints.claimableBalance,
              totalBalance: totalBalance,
            },
          })
        );

        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }

        dispatch(userStatsFetchFail(errorMessage));
      }
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }

      dispatch(userStatsFetchFail(message));
    }
  }
);
