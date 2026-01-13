import express from 'express';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a bid (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ message: 'Gig is not open for bidding' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot bid on your own gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    res.status(201).json(populatedBid);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all bids by the current user (My Bids) - MUST come before /:gigId
router.get('/my/bids', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status ownerId')
      .populate('gigId.ownerId', 'name')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bids by the current user (My Bids) - MUST come before /:gigId route
router.get('/my/bids', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status ownerId')
      .populate('gigId.ownerId', 'name')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bids for a specific gig (protected, only gig owner can see)
router.get('/:gigId', protect, async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these bids' });
    }

    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hire a freelancer (Atomic Transaction)
router.patch('/:bidId/hire', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId).session(session)
      .populate('gigId');
    
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId._id).session(session);
    
    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Gig is not open' });
    }

    // Atomic transaction: Update gig status, hired bid, and reject all other bids
    await Gig.findByIdAndUpdate(gig._id, { status: 'assigned' }, { session });
    await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Get the updated bid with populated data for socket emit
    const updatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    // Emit real-time event to the hired freelancer
    const io = req.app.get('io');
    io.to(`user_${updatedBid.freelancerId._id.toString()}`).emit('hired', {
      message: `You have been hired for ${updatedBid.gigId.title}!`,
      gigId: updatedBid.gigId._id,
      bidId: updatedBid._id
    });

    res.json({
      message: 'Freelancer hired successfully',
      bid: updatedBid
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
});

export default router;
