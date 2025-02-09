// routes/mealRecords.js
import express from 'express';
import MealRecord from '../models/MealRecord.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new meal record
router.post('/residents/:residentId/meals', protect, async (req, res) => {
  try {
    const mealRecord = new MealRecord({
      residentId: req.params.residentId,
      ...req.body
    });
    
    await mealRecord.save();
    
    res.status(201).json({ mealRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get meal record for a resident
router.get('/residents/:residentId/meals', protect, async (req, res) => {
  try {
    const mealRecords = await MealRecord.find({ 
      residentId: req.params.residentId 
    }).sort({ createdAt: -1 }); // Sort in descending order
    
    if (!mealRecords || mealRecords.length === 0) {
      return res.status(404).json({ message: 'No meal records found for this resident' });
    }
    
    res.json({ mealRecords }); // Note the plural 'mealRecords'
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update meal record
router.put('/residents/:residentId/meals/:recordId', protect, async (req, res) => {
  try {
    const updatedRecord = await MealRecord.findByIdAndUpdate(
      req.params.recordId,
      req.body,
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Meal record not found' });
    }
    
    res.json({ mealRecord: updatedRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;