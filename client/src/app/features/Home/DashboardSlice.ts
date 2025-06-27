import agent from "@/app/api/agent";
import type { DailyDelivery, DashboardMetrics, DeliveryStats, RecentActivity, WeeklyTrend } from "@/app/models/dashboard";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
    metrics: DashboardMetrics | null;
    dailyDeliveries: DailyDelivery[];
    weeklyTrend: WeeklyTrend[];
    recentActivity: RecentActivity[];
    stats: DeliveryStats | null;
    loading: {
        metrics: boolean;
        dailyDeliveries: boolean;
        weeklyTrend: boolean;
        recentActivity: boolean;
        stats: boolean;
    };
    error: {
        metrics: string | null;
        dailyDeliveries: string | null;
        weeklyTrend: string | null;
        recentActivity: string | null;
        stats: string | null;
    };
    lastUpdated: string | null;
}

const initialState: DashboardState = {
    metrics: null,
    dailyDeliveries: [],
    weeklyTrend: [],
    recentActivity: [],
    stats: null,
    loading: {
        metrics: false,
        dailyDeliveries: false,
        weeklyTrend: false,
        recentActivity: false,
        stats: false,
    },
    error: {
        metrics: null,
        dailyDeliveries: null,
        weeklyTrend: null,
        recentActivity: null,
        stats: null,
    },
    lastUpdated: null,
};

// Async thunks
export const fetchDashboardMetrics = createAsyncThunk(
    'dashboard/fetchMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await agent.Dashboard.getMetrics();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch dashboard metrics');
        }
    }
);

export const fetchDailyDeliveries = createAsyncThunk(
    'dashboard/fetchDailyDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            const response = await agent.Dashboard.getDailyDeliveries();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch daily deliveries');
        }
    }
);

export const fetchWeeklyTrend = createAsyncThunk(
    'dashboard/fetchWeeklyTrend',
    async (_, { rejectWithValue }) => {
        try {
            const response = await agent.Dashboard.getWeeklyTrend();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch weekly trend');
        }
    }
);

export const fetchRecentActivity = createAsyncThunk(
    'dashboard/fetchRecentActivity',
    async (_, { rejectWithValue }) => {
        try {
            const response = await agent.Dashboard.getRecentActivity();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch recent activity');
        }
    }
);

export const fetchDeliveryStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await agent.Dashboard.getStats();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch delivery stats');
        }
    }
);

// Thunk to fetch all dashboard data at once
export const fetchAllDashboardData = createAsyncThunk(
    'dashboard/fetchAllData',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await Promise.all([
                dispatch(fetchDashboardMetrics()),
                dispatch(fetchDailyDeliveries()),
                dispatch(fetchWeeklyTrend()),
                dispatch(fetchRecentActivity()),
                dispatch(fetchDeliveryStats()),
            ]);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch dashboard data');
        }
    }
);

// Dashboard slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state, action: PayloadAction<keyof DashboardState['error']>) => {
            state.error[action.payload] = null;
        },
        clearAllDashboardErrors: (state) => {
            Object.keys(state.error).forEach(key => {
                state.error[key as keyof DashboardState['error']] = null;
            });
        },
        resetDashboard: (state) => {
            return initialState;
        },
        updateLastRefreshed: (state) => {
            state.lastUpdated = new Date().toISOString();
        },
    },
    extraReducers: (builder) => {
        // Dashboard Metrics
        builder
            .addCase(fetchDashboardMetrics.pending, (state) => {
                state.loading.metrics = true;
                state.error.metrics = null;
            })
            .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
                state.loading.metrics = false;
                state.metrics = action.payload;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchDashboardMetrics.rejected, (state, action) => {
                state.loading.metrics = false;
                state.error.metrics = action.payload as string;
            });

        // Daily Deliveries
        builder
            .addCase(fetchDailyDeliveries.pending, (state) => {
                state.loading.dailyDeliveries = true;
                state.error.dailyDeliveries = null;
            })
            .addCase(fetchDailyDeliveries.fulfilled, (state, action) => {
                state.loading.dailyDeliveries = false;
                state.dailyDeliveries = action.payload;
            })
            .addCase(fetchDailyDeliveries.rejected, (state, action) => {
                state.loading.dailyDeliveries = false;
                state.error.dailyDeliveries = action.payload as string;
            });

        // Weekly Trend
        builder
            .addCase(fetchWeeklyTrend.pending, (state) => {
                state.loading.weeklyTrend = true;
                state.error.weeklyTrend = null;
            })
            .addCase(fetchWeeklyTrend.fulfilled, (state, action) => {
                state.loading.weeklyTrend = false;
                state.weeklyTrend = action.payload;
            })
            .addCase(fetchWeeklyTrend.rejected, (state, action) => {
                state.loading.weeklyTrend = false;
                state.error.weeklyTrend = action.payload as string;
            });

        // Recent Activity
        builder
            .addCase(fetchRecentActivity.pending, (state) => {
                state.loading.recentActivity = true;
                state.error.recentActivity = null;
            })
            .addCase(fetchRecentActivity.fulfilled, (state, action) => {
                state.loading.recentActivity = false;
                state.recentActivity = action.payload;
            })
            .addCase(fetchRecentActivity.rejected, (state, action) => {
                state.loading.recentActivity = false;
                state.error.recentActivity = action.payload as string;
            });

        // Delivery Stats
        builder
            .addCase(fetchDeliveryStats.pending, (state) => {
                state.loading.stats = true;
                state.error.stats = null;
            })
            .addCase(fetchDeliveryStats.fulfilled, (state, action) => {
                state.loading.stats = false;
                state.stats = action.payload;
            })
            .addCase(fetchDeliveryStats.rejected, (state, action) => {
                state.loading.stats = false;
                state.error.stats = action.payload as string;
            });
    },
});

export const {
    clearDashboardError,
    clearAllDashboardErrors,
    resetDashboard,
    updateLastRefreshed,
} = dashboardSlice.actions;

export default dashboardSlice;