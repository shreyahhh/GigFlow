const BidList = ({ bids, onHire, gigStatus }) => {
  if (bids.length === 0) {
    return <p className="text-sm text-slate-400">No bids yet</p>
  }

  return (
    <div className="space-y-3">
      {bids.map((bid) => (
        <div
          key={bid._id}
          className={`border rounded-lg p-4 ${
            bid.status === 'hired'
              ? 'border-green-500/50 bg-green-500/10'
              : bid.status === 'rejected'
              ? 'border-red-500/50 bg-red-500/10'
              : 'border-zinc-800 bg-zinc-900/50'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{bid.freelancerId?.name}</h3>
              <p className="text-xs text-slate-400">{bid.freelancerId?.email}</p>
            </div>
            <div className="text-right">
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
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{bid.message}</p>
          {gigStatus === 'open' && bid.status === 'pending' && (
            <button
              onClick={() => onHire(bid._id)}
              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              Hire This Freelancer
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default BidList

