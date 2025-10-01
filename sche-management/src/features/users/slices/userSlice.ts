import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/domain/entities/Users';

// Mock API calls - thay thế bằng API thực
const mockApi = {
  getUserProfile: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      userName: 'john_doe',
      fullName: 'Nguyễn Văn A',
      email: 'john.doe@example.com',
      phoneNumber: '0123456789',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      faculty: 'Công nghệ thông tin',
      interests: ['Lập trình', 'Thiết kế', 'Sự kiện', 'Thể thao'],
      qrCodeIdentifier: 'STU2024001',
      pointBalance: 1250
    };
  },
  
  updateUserProfile: async (userData: Partial<User>): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      userName: 'john_doe',
      fullName: 'Nguyễn Văn A',
      email: 'john.doe@example.com',
      phoneNumber: '0123456789',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      faculty: 'Công nghệ thông tin',
      interests: ['Lập trình', 'Thiết kế', 'Sự kiện', 'Thể thao'],
      qrCodeIdentifier: 'STU2024001',
      pointBalance: 1250,
      ...userData
    };
  },
  
  uploadAvatar: async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return URL.createObjectURL(file);
  }
};

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  isUpdating: false,
  updateError: null
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await mockApi.getUserProfile();
      return user;
    } catch (error) {
      return rejectWithValue('Không thể tải thông tin người dùng');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await mockApi.updateUserProfile(userData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue('Không thể cập nhật thông tin người dùng');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const avatarUrl = await mockApi.uploadAvatar(file);
      return avatarUrl;
    } catch (error) {
      return rejectWithValue('Không thể tải lên ảnh đại diện');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    
    updateUserField: (state, action: PayloadAction<{ field: keyof User; value: string }>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          [action.payload.field]: action.payload.value
        };
      }
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    
    clearUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.isUpdating = false;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = action.payload;
        state.updateError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      });

    // Upload avatar
    builder
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.currentUser) {
          state.currentUser.avatarUrl = action.payload;
        }
        state.updateError = null;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      });
  }
});

export const { 
  clearError, 
  updateUserField, 
  setUser, 
  clearUser 
} = userSlice.actions;

export default userSlice.reducer;
