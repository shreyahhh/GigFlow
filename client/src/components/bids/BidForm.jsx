import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from '../../store/slices/bidsSlice'

const BidForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.bids)

  const [formData, setFormData] = useState({
    message: '',
    price: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) {
      dispatch(clearError())
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      return
    }
    onSubmit({
      ...formData,
      price: price
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-xs font-medium text-slate-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
          placeholder="Explain why you're the best fit for this gig..."
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-xs font-medium text-zinc-300 mb-2">
          Your Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
          placeholder="Enter your bid amount"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BidForm

