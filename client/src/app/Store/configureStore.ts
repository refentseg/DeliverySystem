import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { jobSlice } from "../features/Job/JobSlice";
import dashboardSlice from "../features/Home/DashboardSlice";
import { customerSlice } from "../features/Customer/CustomerSlice";
import { driverSlice } from "../features/Driver/DriverSlice";

export const store = configureStore({
    reducer: {
        jobs:jobSlice.reducer,
        dashboard: dashboardSlice.reducer,
        customers: customerSlice.reducer,
        drivers: driverSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;