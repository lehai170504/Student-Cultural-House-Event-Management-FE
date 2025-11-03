import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slices/authSlice";
import eventCategoryReducer from "@/features/eventCategories/slices/eventCategorySlice";
import eventReducer from "@/features/events/slices/eventSlice";
import universityReducer from "@/features/universities/slices/universitySlice";
import partnerReducer from "@/features/partner/slices/partnerSlice";
import studentReducer from "@/features/students/slices/studentSlice";
import productReducer from "@/features/products/slices/productSlice";
import invoiceReducer from "@/features/invoices/slices/invoiceSlice";

// Store singleton
export const store = configureStore({
  reducer: {
    auth: authReducer,
    eventCategory: eventCategoryReducer,
    event: eventReducer,
    university: universityReducer,
    partner: partnerReducer,
    student: studentReducer,
    product: productReducer,
    invoice: invoiceReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
