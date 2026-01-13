import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigs } from '../../store/slices/gigsSlice'
import { fetchBidsByGigId, createBid, hireFreelancer, clearBids } from '../../store/slices/bidsSlice'
import BidForm from '../bids/BidForm'
import BidList from '../bids/BidList'

const GigDetails = () => {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { gigs } = useSelector((state) => state.gigs)
  const { bids, loading: bidsLoading } = useSelector((state) => state.bids)
  const { user } = useSelector((state) => state.auth)

  const [showBidForm, setShowBidForm] = useState(false)

  const gig = gigs.find((g) => g._id === gigId)

  useEffect(() => {
    // Fetch all gigs to get this one
    dispatch(fetchGigs())
  }, [dispatch, gigId])

  useEffect(() => {
    // Only fetch bids if user is the owner
    if (gig && user && gig.ownerId?._id?.toString() === user.id) {
      dispatch(fetchBidsByGigId(gigId))
    }

    return () => {
      dispatch(clearBids())
    }
  }, [dispatch, gigId, gig, user])

  const handleCreateBid = async (bidData) => {
    const result = await dispatch(createBid({ ...bidData, gigId }))
    if (createBid.fulfilled.match(result)) {
      setShowBidForm(false)
      // Only fetch bids if user is the owner
      if (isOwner) {
        dispatch(fetchBidsByGigId(gigId))
      }
    }
  }

  const handleHire = async (bidId) => {
    const result = await dispatch(hireFreelancer(bidId))
    if (hireFreelancer.fulfilled.match(result)) {
      navigate('/')
    }
  }

  const isOwner = gig && user && gig.ownerId?._id?.toString() === user.id

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-slate-400">Loading gig details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-sm text-zinc-300 hover:text-white transition-colors"
      >
        ← Back to Feed
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 mb-4">
        <h1 className="text-xl font-bold text-slate-100 mb-3">{gig.title}</h1>
        <p className="text-xs text-zinc-400 mb-4 whitespace-pre-wrap leading-relaxed">{gig.description}</p>
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <span className="text-2xl font-bold text-slate-200">${gig.budget}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">
              by {gig.ownerId?.name}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              gig.status === 'open' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {gig.status}
            </span>
          </div>
        </div>
      </div>

      {!isOwner && gig.status === 'open' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-5 mb-4">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              className="w-full px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Place a Bid
            </button>
          ) : (
            <BidForm onSubmit={handleCreateBid} onCancel={() => setShowBidForm(false)} />
          )}
        </div>
      )}

      {isOwner && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Bids on This Gig</h2>
          {bidsLoading ? (
            <p className="text-sm text-zinc-400">Loading bids...</p>
          ) : (
            <BidList bids={bids} onHire={handleHire} gigStatus={gig.status} />
          )}
        </div>
      )}
    </div>
  )
}

export default GigDetails
