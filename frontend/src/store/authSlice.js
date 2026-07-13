import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service.js';
import { userService } from '../services/user.service.js';
import {
  clearSession,
  readToken,
  readUser,
  saveSession
} from '../utils/storage.js';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload) => authService.register(payload)
);

export const loginUser = createAsyncThunk('auth/login', async (payload) =>
  authService.login(payload)
);

export const fetchProfile = createAsyncThunk('auth/profile', async () =>
  userService.getProfile()
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload) => userService.updateProfile(payload)
);

const initialState = {
  token: readToken(),
  user: readUser(),
  profile: null,
  status: 'idle',
  profileStatus: 'idle',
  error: null,
  successMessage: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.profile = null;
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      clearSession();
    },
    clearAuthMessage(state) {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = 'Account created';
        saveSession(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = 'Signed in';
        saveSession(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.profileStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.profile = action.payload;
        state.successMessage = 'Profile updated';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { clearAuthMessage, logout } = authSlice.actions;
export default authSlice.reducer;
