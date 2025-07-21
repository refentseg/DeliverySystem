import agent from "@/app/api/agent";
import type { Customer } from "@/app/models/customer";
import type { RootState } from "@/app/Store/configureStore";
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";

interface CustomerState{
    customersLoaded: boolean;
    status: string;
}

const customersAdapter  = createEntityAdapter<Customer>()

export const fetchCustomersAsync = createAsyncThunk<Customer[], void, {state: RootState}>(
    'customers/fetchCustomersAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Customer.list();
            return response.data || response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                error: error.data || 'Problem fetching customers'
            });
        }
    }
)

export const fetchCustomerAsync = createAsyncThunk<Customer, number>(
    'customers/fetchCustomerAsync',
    async (customerId, thunkAPI) => {
        try {
            const response = await agent.Customer.details(customerId);
            return response.data || response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                error: error.data || 'Problem fetching customer details'
            });
        }
    }
)

export const customerSlice = createSlice({
    name: 'customer',
    initialState: customersAdapter.getInitialState<CustomerState>({
        customersLoaded: false,
        status: 'idle'
    }),
    reducers: {
        setCustomer: (state, action) => {
            customersAdapter.setOne(state, action.payload);
            state.customersLoaded = false;
        },
        removeCustomer: (state, action) => {
            customersAdapter.removeOne(state, action.payload);
            state.customersLoaded = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCustomersAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
            customersAdapter.setAll(state, action.payload);
            state.customersLoaded = true;
            state.status = 'idle';
        })
        .addCase(fetchCustomersAsync.rejected, (state, action) => {
            state.status = 'idle';
        })
        .addCase(fetchCustomerAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchCustomerAsync.fulfilled, (state, action) => {
            customersAdapter.upsertOne(state, action.payload);
            state.customersLoaded = true;
            state.status = 'idle';
        })
        .addCase(fetchCustomerAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
    }
});

export const customerSelectors = customersAdapter.getSelectors((state: RootState) => state.customers);
export const { setCustomer, removeCustomer } = customerSlice.actions;