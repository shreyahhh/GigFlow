import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/axios.js'

const API_URL = '/api/bids'

// Create a bid
export const createBid = createAsyncThunk(
  'bids/createBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_URL, bidData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bid')
    }
  }
)

// Get bids for a gig
export const fetchBidsByGigId = createAsyncThunk(
  'bids/fetchBidsByGigId',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${gigId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids')
    }
  }
)

// Get current user's bids (My Bids)
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMyBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/my/bids`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your bids')
    }
  }
)

// Hire a freelancer
export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`${API_URL}/${bidId}/hire`, {})
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to hire freelancer')
    }
  }
)

const bidsSlice = createSlice({
  name: 'bids',
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearBids: (state) => {
      state.bids = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBid.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch bids
      .addCase(fetchBidsByGigId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBidsByGigId.fulfilled, (state, action) => {
        state.loading = false
        state.bids = action.payload
      })
      .addCase(fetchBidsByGigId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Hire freelancer
      .addCase(hireFreelancer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.loading = false
        // Update the bid status in the list
        const bid = state.bids.find(b => b._id === action.payload.bid._id)
        if (bid) {
          bid.status = 'hired'
        }
        // Update all other bids to rejected
        state.bids.forEach(b => {
          if (b._id !== action.payload.bid._id) {
            b.status = 'rejected'
          }
        })
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false
        state.myBids = action.payload
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearBids } = bidsSlice.actions
export default bidsSlice.reducer

