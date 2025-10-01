import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '@/features/users/slices/userSlice';

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here as needed
});

export default rootReducer;
