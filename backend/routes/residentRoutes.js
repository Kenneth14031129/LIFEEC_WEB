import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Resident from '../models/AddResident.js';

const router = express.Router();

// GET /api/residents
router.get('/', protect, async (req, res) => {
  try {
    const residents = await Resident.find({});
    res.json({ success: true, residents });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching residents',
      error: error.message
    });
  }
});

export default router;