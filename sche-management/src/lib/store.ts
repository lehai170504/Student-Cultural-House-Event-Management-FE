import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import userReducer from "@/features/users/slices/userSlice";
import eventCategoryReducer from "@/features/eventCategories/slices/eventCategorySlice";

// Store singleton
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    eventCategory: eventCategoryReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
