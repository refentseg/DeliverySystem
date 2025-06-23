import agent from "@/app/api/agent";
import type { Job } from "@/app/models/job";
import type { RootState } from "@/app/Store/configureStore";
import { createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

interface JobState{
    jobsloaded: boolean;
    status: string;
}

const jobsAdapter  = createEntityAdapter<Job>()

export const fetchJobsAsync = createAsyncThunk<Job[], void, {state: RootState}>(
    'jobs/fetchJobsAsync',
    async (_, thunkAPI) => {
    try {
      const response = await agent.Job.list();
      return response.data || response;
    } catch (error: any) {
      return  thunkAPI.rejectWithValue({
        error:error.data || 'Problem fetching jobs'})
    }
  }
)

export const fetchJobAsync = createAsyncThunk<Job, number>(
  'jobs/fetchJobAsync',
  async (jobId, thunkAPI) => {
    try {
      const response = await agent.Job.details(jobId);
      return response.data || response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        error:error.data || 'Problem fetching job details'
      });
    }
  }
)

export const jobSlice = createSlice({
    name: 'job',
    initialState: jobsAdapter.getInitialState<JobState>({
        jobsloaded: false,
        status: 'idle'
    }),
    reducers:{
        setJob: (state, action) => {
            jobsAdapter.setOne(state, action.payload);
            state.jobsloaded = false;
        },
        removeJob: (state, action) => {
            jobsAdapter.removeOne(state, action.payload);
            state.jobsloaded = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchJobsAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchJobsAsync.fulfilled, (state, action) => {
            jobsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.jobsloaded = true;
        })
        .addCase(fetchJobsAsync.rejected, (state, action) => {
            console.error(action.payload);
            state.status = 'idle';
        })
        .addCase(fetchJobAsync.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchJobAsync.fulfilled, (state, action) => {
            jobsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        })
        .addCase(fetchJobAsync.rejected, (state, action) => {
            console.error(action.payload);
            state.status = 'idle';
        });
    }
})

export const jobSelectors = jobsAdapter.getSelectors((state: RootState) => state.jobs)
export const {setJob, removeJob} = jobSlice.actions;