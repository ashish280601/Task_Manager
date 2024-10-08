import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../configAPI";
import { toast } from "react-toastify";

function getToken() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  return userData.token
}

export const signUpUser = createAsyncThunk(
  "signup/signupUser",
  async (formData, { rejectWithValue }) => {
    console.log("formData", formData);

    try {
      const res = await axiosInstance.post("/api/user/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Signup successful", res.data);
      return res.data;
    } catch (error) {
      console.log("Failed to create account", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/login/loginUser",
  async (userData, { rejectWithValue }) => {
    console.log("user login data", userData);

    try {
      const res = await axiosInstance.post("/api/user/login", userData);
      console.log("Login Successful", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while login", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const OTPRequests = createAsyncThunk(
  "otp/request",
  async ({ userID }, { rejectWithValue }) => {
    const token = getToken();
    console.log("token", token);
    try {
      const res = await axiosInstance.post(
        "/api/user/request-reset-password", { userID }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      );
      console.log("OTP send successfull to mail", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while requesting otp", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "otp/verify",
  async ({ otp }, { rejectWithValue }) => {
    const token = getToken();
    console.log("token", token);
    try {
      const res = await axiosInstance.post(
        "/api/user/verify-otp",
        { otp }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      );
      console.log("OTP verify successfull", res.data);
      return res.data;
    } catch (error) {
      console.error("Invalid OTP", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "forget/forgetPassword",
  async ({ newPassword }, { rejectWithValue }) => {
    const token = getToken();
    console.log("token", token);
    try {
      const res = await axiosInstance.post(
        "/api/user/resetPassword",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Password reset successful", res.data);
      return res.data;
    } catch (error) {
      console.error("Error while changing password", error);
      return rejectWithValue(error.res.data);
    }
  }
);

export const googleAuthSlice = createAsyncThunk(
  'google/auth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/auth/google");
      console.log('google signIN res', res);
      return res.data;
    } catch (error) {
      console.error('Error while google signup', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userLogin: null,
    otpRequest: null,
    verifyOTP: null,
    resetPassword: null,
    isLoading: false,
    message: "",
    isSession: JSON.parse(sessionStorage.getItem("userData")) || false,
    togglePassword: {
      loginTogglePassword: false,
      signUpTogglePassword: false,
      newPassword: false,
      confirmPassword: false,
    },
    error: null,
  },
  reducers: {
    // it is used to handle synchronous data}
    togglePasswordVisibility: (state, action) => {
      const field = action.payload;
      state.togglePassword[field] = !state.togglePassword[field];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        if (action?.payload?.success) {
          state.message = action.payload.message
          toast.success(state.message);
        }
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = action.payload.message;
        toast.error(state.message)
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("login payload", action.payload);

        state.isLoading = false;
        state.userLogin = action.payload;
        console.log("actioon payload", action.payload);
        state.isSession = action.payload.data;
        sessionStorage.setItem("userData", JSON.stringify(state.isSession));
        console.log("session data", state.isSession);
        if (action?.payload?.data?.success) {
          state.message = action.payload.data.message
          toast.success(state.message);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("login rejected payload", action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.message = action?.payload?.message
        toast.error(state.message);
        return

      })
      .addCase(OTPRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(OTPRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpRequest = action.payload;
      })
      .addCase(OTPRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifyOTP = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resetPassword = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(googleAuthSlice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuthSlice.fulfilled, (state, action) => {
        console.log("Action google payload fulfilled", action.payload);
        state.isLoading = false;
        state.isSession = action.payload.data;
        sessionStorage.setItem("googleAuth", JSON.stringify(state.isSession));
        console.log("session data", state.isSession);
      })
      .addCase(googleAuthSlice.rejected, (state, action) => {
        console.log("action payload rejected", action.payload);
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { togglePasswordVisibility } = authSlice.actions;
export const authReducer = authSlice.reducer;