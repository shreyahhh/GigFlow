import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axios.js'

const API_URL = '/api/gigs'

// Get all gigs
export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { search, status } = params
      const response = await axiosInstance.get(API_URL, {
        params: { search, status } // No default status - show all gigs
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gigs')
    }
  }
)

// Create a gig
export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL, gigData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig')
    }
  }
)

const gigsSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch gigs
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false
        state.gigs = action.payload
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false
        state.gigs.unshift(action.payload)
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError } = gigsSlice.actions
export default gigsSlice.reducer


