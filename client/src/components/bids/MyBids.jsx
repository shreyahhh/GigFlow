import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyBids } from '../../store/slices/bidsSlice'

const MyBids = () => {
  const dispatch = useDispatch()
  const { myBids, loading } = useSelector((state) => state.bids)

  useEffect(() => {
    dispatch(fetchMyBids())
  }, [dispatch])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-slate-400">Loading your bids...</p>
        </div>
      </div>
    )
  }

  if (myBids.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">My Bids</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-8 text-center">
          <p className="text-sm text-zinc-400 mb-4">You haven't placed any bids yet.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Browse Gigs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">My Bids</h1>
      
      <div className="space-y-4">
        {myBids.map((bid) => (
          <div
            key={bid._id}
            className={`bg-zinc-900 border rounded-xl p-5 ${
              bid.status === 'hired'
                ? 'border-green-500/50 bg-green-500/10'
                : bid.status === 'rejected'
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <Link
                  to={`/gigs/${bid.gigId?._id}`}
                  className="text-base font-semibold text-slate-100 hover:text-white transition-colors"
                >
                  {bid.gigId?.title}
                </Link>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {bid.gigId?.description}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-lg font-bold text-slate-200">${bid.price}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    bid.status === 'hired'
                      ? 'bg-green-500/20 text-green-400'
                      : bid.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {bid.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>Budget: ${bid.gigId?.budget}</span>
                <span>•</span>
                <span>Posted by: {bid.gigId?.ownerId?.name}</span>
                <span>•</span>
                <span>Gig Status: {bid.gigId?.status}</span>
              </div>
              <Link
                to={`/gigs/${bid.gigId?._id}`}
                className="px-3 py-1.5 text-xs bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                View Gig
              </Link>
            </div>

            <div className="mt-3 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-400 mb-1">Your Message:</p>
              <p className="text-xs text-slate-300 leading-relaxed">{bid.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBids


