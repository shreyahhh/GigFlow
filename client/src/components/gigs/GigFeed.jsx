import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigs } from '../../store/slices/gigsSlice'

const GigFeed = () => {
  const dispatch = useDispatch()
  const { gigs, loading } = useSelector((state) => state.gigs)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'open', 'assigned'

  useEffect(() => {
    const params = { search: searchQuery }
    if (statusFilter !== 'all') {
      params.status = statusFilter
    }
    dispatch(fetchGigs(params))
  }, [dispatch, searchQuery, statusFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchGigs({ search: searchQuery }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-3">All Gigs</h1>
        <form onSubmit={handleSearch} className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Search gigs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Search
          </button>
        </form>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              statusFilter === 'open'
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('assigned')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              statusFilter === 'assigned'
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            Closed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-zinc-400">Loading gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-zinc-400">No gigs available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gigs.map((gig) => (
            <div key={gig._id} className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-slate-100 line-clamp-2 flex-1 pr-2">{gig.title}</h3>
                <span className="text-lg font-bold text-slate-200 whitespace-nowrap">${gig.budget}</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">{gig.description}</p>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">by {gig.ownerId?.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  gig.status === 'open' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {gig.status === 'open' ? 'Open' : 'Closed'}
                </span>
              </div>
              {isAuthenticated ? (
                <Link
                  to={`/gigs/${gig._id}`}
                  className="block w-full text-center px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  View Details
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Login to View
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GigFeed

