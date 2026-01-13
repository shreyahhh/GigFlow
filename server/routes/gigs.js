import express from 'express';
import Gig from '../models/Gig.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all gigs (public, with optional status filter and search query)
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    // If status is specified, filter by it; otherwise show all
    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a gig (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email');

    res.status(201).json(populatedGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


