import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'
import { SOCKET_URL } from '../../config/api.js'

const SocketConnection = ({ userId }) => {
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
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [userId])

  return null
}

export default SocketConnection


