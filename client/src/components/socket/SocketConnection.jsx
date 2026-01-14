import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'
import { SOCKET_URL } from '../../config/api.js'
import { fetchMyBids } from '../../store/slices/bidsSlice'

const SocketConnection = ({ userId }) => {
  const dispatch = useDispatch()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    // Connect to socket server
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true
    })

    // Join user's personal room
    socketRef.current.emit('join', `user_${userId}`)

    // Listen for hire events
    socketRef.current.on('hired', (data) => {
      toast.success(data.message, {
        position: 'top-right',
        autoClose: 5000
      })
      // Refresh My Bids to show updated status without page refresh
      dispatch(fetchMyBids())
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [userId, dispatch])

  return null
}

export default SocketConnection


