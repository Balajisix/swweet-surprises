import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import BACKEND_URL from '../../config/url';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  authChecked: false, // New flag to indicate that auth has been checked
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/check-auth`, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { success: false };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Custom reducer if needed
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      
      // Check Authentication
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      
      // Logout User
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
