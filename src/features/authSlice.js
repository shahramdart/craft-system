import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const LoginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email: user.email,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        "Something went wrong";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk("user/getUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:4000/api/getUser");
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.msg) ||
      error.message ||
      "Something went wrong";
    return thunkAPI.rejectWithValue(message);
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
  await axios.delete("http://localhost:4000/api/logout");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Getting user when logged in
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
