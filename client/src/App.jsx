/**
 * GigFlow App Component
 * Main application component with routing and authentication
 */

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/slices/authSlice'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import GigFeed from './components/gigs/GigFeed'
import CreateGig from './components/gigs/CreateGig'
import GigDetails from './components/gigs/GigDetails'
import MyBids from './components/bids/MyBids'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/routing/ProtectedRoute'
import SocketConnection from './components/socket/SocketConnection'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Validate user session on app load
  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black">
      {isAuthenticated && <SocketConnection userId={user?.id} />}
      <Navbar />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<GigFeed />} />
        <Route
          path="/gigs/create"
          element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gigs/:gigId"
          element={
            <ProtectedRoute>
              <GigDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App

