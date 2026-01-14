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

// Hire a freelancer (Atomic Transaction with Race Condition Prevention)
router.patch('/:bidId/hire', protect, async (req, res) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { bidId } = req.params;

      // Get bid with gig populated (within transaction for consistency)
      const bid = await Bid.findById(bidId).session(session)
        .populate('gigId');
      
      if (!bid) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Bid not found' });
      }

      const gigId = bid.gigId._id;

      // Check if user is the gig owner (read within transaction)
      const gigCheck = await Gig.findById(gigId).session(session)
        .select('ownerId status');
      
      if (!gigCheck) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Gig not found' });
      }

      if (gigCheck.ownerId.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ message: 'Not authorized to hire for this gig' });
      }

      // ATOMIC OPERATION: Only update if gig status is 'open'
      // This prevents race conditions - if two requests try simultaneously,
      // only one will succeed (the one that finds status='open')
      const updatedGig = await Gig.findOneAndUpdate(
        { 
          _id: gigId, 
          status: 'open'  // CRITICAL: Only update if still open
        },
        { status: 'assigned' },
        { 
          session,
          new: true,
          runValidators: true
        }
      );

      // If update returned null, gig was already assigned (race condition detected)
      if (!updatedGig) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ 
          message: 'Gig is no longer open. Another user may have already hired a freelancer.' 
        });
      }

      // Update the hired bid
      await Bid.findByIdAndUpdate(
        bidId, 
        { status: 'hired' }, 
        { session }
      );

      // Reject all other bids for this gig
      await Bid.updateMany(
        { gigId: gigId, _id: { $ne: bidId } },
        { status: 'rejected' },
        { session }
      );

      // Commit transaction - all operations succeed or all fail
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

      return res.json({
        message: 'Freelancer hired successfully',
        bid: updatedBid
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      // Handle write conflicts (can occur in high concurrency)
      if (error.code === 112 || error.codeName === 'WriteConflict') {
        retries++;
        if (retries < maxRetries) {
          // Exponential backoff: wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 50 * retries));
          continue; // Retry the transaction
        }
      }

      // For other errors or max retries reached, return error
      return res.status(500).json({ 
        message: error.message || 'Failed to hire freelancer. Please try again.' 
      });
    }
  }

  // If we exhausted all retries
  return res.status(500).json({ 
    message: 'Failed to complete hire operation due to high concurrency. Please try again.' 
  });
});

export default router;
