import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-zinc-200 hover:text-white transition-colors">
              GigFlow
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/gigs/create"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Post a Gig
                </Link>
                <Link
                  to="/my-bids"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  My Bids
                </Link>
                <span className="text-xs text-zinc-300">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

