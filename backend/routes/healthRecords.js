// routes/healthRecords.js
import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new health record
router.post('/residents/:residentId/health', protect, async (req, res) => {
  try {
    const healthRecord = new HealthRecord({
      residentId: req.params.residentId,
      ...req.body
    });
    
    await healthRecord.save();
    
    res.status(201).json({ healthRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all health records for a resident
router.get('/residents/:residentId/health', protect, async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({ 
      residentId: req.params.residentId 
    }).sort({ createdAt: -1 });
    
    res.json({ healthRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a health record
router.put('/residents/:residentId/health/:recordId', protect, async (req, res) => {
  try {
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.recordId,
      req.body,
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    res.json({ healthRecord: updatedRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;