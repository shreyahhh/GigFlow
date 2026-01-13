import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createGig, clearError } from '../../store/slices/gigsSlice'

const CreateGig = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.gigs)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  })

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
    const result = await dispatch(createGig({
      ...formData,
      budget: parseFloat(formData.budget)
    }))
    
    if (createGig.fulfilled.match(result)) {
      navigate('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-5">Post a New Gig</h2>
        
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-zinc-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
              placeholder="Enter gig title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-medium text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
              placeholder="Describe your gig in detail"
            />
          </div>

          <div>
            <label htmlFor="budget" className="block text-xs font-medium text-zinc-300 mb-2">
              Budget ($)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              required
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-black border border-zinc-800 rounded-lg text-slate-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
              placeholder="Enter budget"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Posting...' : 'Post Gig'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGig

