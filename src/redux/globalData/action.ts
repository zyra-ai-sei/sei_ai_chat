import { globalDataSlice } from "./reducer";
import { IRootState } from "../store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/services/axios";

export const {
  globalDataGetFail,
  setGlobalData,
  resetGlobalData,
  setGLobalDataLoadingEnd,
  setGLobalDataLoadingStart,
  setGLobalMobileData,
} = globalDataSlice.actions;

interface FetchEmailOtpOptions {
  email: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface VerifyEmailOtpOptions {
  email: string;
  otp: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}
interface FetchUserDetailsOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
  setUserData: (
    name: string,
    email: string,
    earlyFan: boolean,
    tgVerified: boolean,
    referralCode: string
  ) => void;
}

interface UpdateUserDetailsOptions {
  email?: string;
  name?: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}
interface SetTelegramAuthOptions {
  auth_date: number;
  hash: string;
  id: number;
  first_name: string;
  last_name: string;
  photo_url: string;
  username: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface VerifyUserTelegramOptions {
  auth_date: number;
  hash: string;
  id: number;
  first_name: string;
  last_name: string;
  photo_url: string;
  username: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface UpdateUserRatingsOptions {
  rating: number;
  message: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface UpdateUserReferralOptions {
  inviteCode: string;
  name: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface ValidateUserReferralOptions {
  inviteCode: string;
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface LogoutUserOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

interface ValidateTokenOptions {
  onSuccessCb?: () => void;
  onFailureCb?: (message: string) => void;
}

export const fetchEmailOtp = createAsyncThunk<
  void,
  FetchEmailOtpOptions,
  { state: IRootState }
>(
  "emailVerification/getOtp",
  async ({ onFailureCb, onSuccessCb, email }, { dispatch }) => {
    try {
      dispatch(setGLobalDataLoadingStart());
      const response = await axiosInstance.post("/mail", {
        email,
      });
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);

export const verifyEmailOtp = createAsyncThunk<
  void,
  VerifyEmailOtpOptions,
  { state: IRootState }
>(
  "emailVerification/getOtp",
  async ({ onFailureCb, onSuccessCb, email, otp }, { dispatch }) => {
    try {
      dispatch(setGLobalDataLoadingStart());
      const response = await axiosInstance.post("/mail/verify/otp", {
        email,
        otp,
      });
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);
export const fetchUserData = createAsyncThunk<
  void,
  FetchUserDetailsOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({ onFailureCb, onSuccessCb, setUserData }, { dispatch }) => {
    try {
      dispatch(setGLobalDataLoadingStart());
      const response = await axiosInstance.get("/users");
      const isSuccess = response?.data?.status === 200;
      const data = response?.data?.data as {
        name: string;
        email: string;
        earlyFan: boolean;
        tgVerified: boolean;
        referralCode: string;
      };

      if (isSuccess) {
        if (setUserData) {
          setUserData(
            data?.name,
            data.email,
            data?.earlyFan,
            data?.tgVerified,
            data?.referralCode
          );
        }

        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);

export const updateUserData = createAsyncThunk<
  void,
  UpdateUserDetailsOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({ onFailureCb, onSuccessCb, email, name }) => {
    try {
      let payload = {};
      if (name && !email) {
        payload = { name };
      } else if (!name && email) {
        payload = { email };
      } else if (name && email) {
        payload = { name, email };
      }

      const response = await axiosInstance.post("/users", payload);
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage =
          response?.data?.data?.error ||
          "Something went wrong, please try again";
        console.log(response?.data?.data?.error, response?.data);
        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      setGLobalDataLoadingEnd();
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      setGLobalDataLoadingEnd();
    }
  }
);

export const setTelegramAuthData = createAsyncThunk<
  void,
  SetTelegramAuthOptions,
  { state: IRootState }
>(
  "setTelegramData",
  async ({
    onFailureCb,
    onSuccessCb,
    auth_date,
    hash,
    id,
    username,
    first_name,
    last_name,
    photo_url,
  }) => {
    try {
      const response = await axiosInstance.post("/auth/tg", {
        auth_date,
        hash,
        id,
        first_name,
        last_name,
        username,
        photo_url,
      });
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
    }
  }
);

export const verifyUserTelegramData = createAsyncThunk<
  void,
  VerifyUserTelegramOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({
    onFailureCb,
    onSuccessCb,
    auth_date,
    hash,
    id,
    username,
    first_name,
    last_name,
    photo_url,
  }) => {
    try {
      setGLobalDataLoadingStart();
      const response = await axiosInstance.get(
        `auth/tg/verify?hash=${hash}&id=${id}&auth_date=${auth_date}&username=${username}&first_name=${first_name}&last_name=${last_name}&photo_url=${photo_url}`
      );
      const isSuccess = response?.data?.status === 200;

      if (isSuccess) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = "Something went wrong, please try again";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      setGLobalDataLoadingEnd();
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      setGLobalDataLoadingEnd();
    }
  }
);

export const updateRating = createAsyncThunk<
  void,
  UpdateUserRatingsOptions,
  { state: IRootState }
>(
  "userRating/updateRating",
  async ({ onFailureCb, onSuccessCb, rating, message }, { dispatch }) => {
    try {
      dispatch(setGLobalDataLoadingStart());
      const response = await axiosInstance.post("/users/feedback", {
        rating,
        message,
      });
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage =
          response?.data?.data?.error ||
          "Something went wrong, please try again";
        console.log(response?.data?.data?.error, response?.data);
        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);

export const updateUserReferral = createAsyncThunk<
  void,
  UpdateUserReferralOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({ onFailureCb, onSuccessCb, inviteCode, name }, { dispatch }) => {
    dispatch(setGLobalDataLoadingStart());
    try {
      const payload = { inviteCode, name };

      const response = await axiosInstance.post("/users", payload);
      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage =
          response?.data?.data?.error ||
          "Something went wrong, please try again";
        console.log(response?.data?.data?.error, response?.data);
        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message ||
        "Something went wrong, please try again";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);

export const validateUserReferral = createAsyncThunk<
  void,
  ValidateUserReferralOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({ onFailureCb, onSuccessCb, inviteCode }, { dispatch }) => {
    dispatch(setGLobalDataLoadingStart());
    try {
      const response = await axiosInstance.get(
        `/users/referrer?referralCode=${inviteCode}`
      );

      const data = response?.data?.data?.referrerAddress;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = response?.data?.data?.error || "Invalid Code";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message || "Invalid Code";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);

export const logoutUserRequest = createAsyncThunk<
  void,
  LogoutUserOptions,
  { state: IRootState }
>("fetchUserData/fetchDetails", async ({ onFailureCb, onSuccessCb }) => {
  try {
    const response = await axiosInstance.post(`/auth/logout`);

    const data = response?.data?.status === 200;

    if (data) {
      if (onSuccessCb) {
        onSuccessCb();
      }
    } else {
      const errorMessage =
        response?.data?.data?.error || "Something went wrong";

      if (onFailureCb) {
        onFailureCb(errorMessage);
      }
    }
  } catch (err) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any)?.response?.data?.error?.message || "Something Went wrong";

    if (onFailureCb) {
      onFailureCb(message);
    }
  }
});

export const validateToken = createAsyncThunk<
  void,
  ValidateTokenOptions,
  { state: IRootState }
>(
  "fetchUserData/fetchDetails",
  async ({ onFailureCb, onSuccessCb }, { dispatch }) => {
    dispatch(setGLobalDataLoadingStart());
    try {
      const response = await axiosInstance.post(`/auth/verify`);

    

      const data = response?.data?.status === 200;

      if (data) {
        if (onSuccessCb) {
          onSuccessCb();
        }
      } else {
        const errorMessage = response?.data?.data?.error || "Invalid Code";

        if (onFailureCb) {
          onFailureCb(errorMessage);
        }
      }
      dispatch(setGLobalDataLoadingEnd());
    } catch (err) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err as any)?.response?.data?.error?.message || "Invalid Code";

      if (onFailureCb) {
        onFailureCb(message);
      }
      dispatch(setGLobalDataLoadingEnd());
    }
  }
);
