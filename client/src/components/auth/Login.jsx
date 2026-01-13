import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../../store/slices/authSlice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(login(formData))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-xl font-bold text-slate-100">
            Sign in to GigFlow
          </h2>
        </div>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium rounded-lg text-white bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

