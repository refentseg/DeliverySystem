import agent from "@/app/api/agent";
import type { Driver } from "@/app/models/driver";
import type { RootState } from "@/app/Store/configureStore";
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

interface DriverState {
    driversLoaded: boolean;
    status: string;
}

const driversAdapter = createEntityAdapter<Driver>();

export const fetchDriversAsync = createAsyncThunk<Driver[], void, { state: RootState }>(
    'drivers/fetchDriversAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Driver.list();
            return response.data || response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                error: error.data || 'Problem fetching drivers'
            });
        }
    }
);
export const fetchDriverAsync = createAsyncThunk<Driver, number>(
    'drivers/fetchDriverAsync',
    async (driverId, thunkAPI) => {
        try {
            const response = await agent.Driver.details(driverId);
            return response.data || response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                error: error.data || 'Problem fetching driver details'
            });
        }
    }
);

export const driverSlice = createSlice({
    name: 'driver',
    initialState: driversAdapter.getInitialState<DriverState>({
        driversLoaded: false,
        status: 'idle'
    }),
    reducers: {
        setDriver: (state, action) => {
            driversAdapter.setOne(state, action.payload);
            state.driversLoaded = false;
        },
        removeDriver: (state, action) => {
            driversAdapter.removeOne(state, action.payload);
            state.driversLoaded = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDriversAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchDriversAsync.fulfilled, (state, action) => {
            driversAdapter.setAll(state, action.payload);
            state.driversLoaded = true;
            state.status = 'idle';
        })
        .addCase(fetchDriversAsync.rejected, (state) => {
            state.status = 'idle';
        });
    }
});
export const driverSelectors = driversAdapter.getSelectors((state: RootState) => state.drivers);
export const { setDriver, removeDriver } = driverSlice.actions;