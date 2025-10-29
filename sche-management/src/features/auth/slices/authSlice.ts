import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "@/features/auth/services/authService";
import {
  AuthState,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/features/auth/types/auth";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    const result = await authService.signIn(
      credentials.email,
      credentials.password
    );
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterFormData, { rejectWithValue }) => {
    const result = await authService.signUp(
      userData.email,
      userData.password,
      userData.name
    );
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const confirmUser = createAsyncThunk(
  "auth/confirmUser",
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    const result = await authService.confirmSignUp(email, code);
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    const result = await authService.signOut();
    if (result.success) {
      return true;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    const result = await authService.getCurrentUser();
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    const isAuthenticated = await authService.isAuthenticated();
    if (isAuthenticated) {
      const result = await authService.getCurrentUser();
      if (result.success) {
        return result.data;
      }
    }
    return null;
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    const result = await authService.forgotPassword(email);
    if (result.success) {
      return true;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { email, code, newPassword }: ResetPasswordFormData,
    { rejectWithValue }
  ) => {
    const result = await authService.forgotPasswordSubmit(
      email,
      code,
      newPassword
    );
    if (result.success) {
      return true;
    } else {
      return rejectWithValue(result.error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Confirm User
      .addCase(confirmUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(confirmUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
