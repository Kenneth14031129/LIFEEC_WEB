// routes/activitiesRecords.js
import express from 'express';
import ActivitiesRecord from '../models/ActivitiesRecord.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new activity record
router.post('/residents/:residentId/activities', protect, async (req, res) => {
  try {
    const { activities } = req.body;
    
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ message: 'Invalid activities data' });
    }

    const activity = activities[0]; // Take the first activity from the array
    
    const activityRecord = new ActivitiesRecord({
      residentId: req.params.residentId,
      ...activity
    });
    
    await activityRecord.save();
    
    res.status(201).json({ 
      message: 'Activity record created successfully',
      activitiesRecord: activityRecord
    });
  } catch (error) {
    console.error('Activity Creation Error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all activity records for a resident
router.get('/residents/:residentId/activities', protect, async (req, res) => {
  try {
    const activities = await ActivitiesRecord.find({ 
      residentId: req.params.residentId 
    }).sort({ date: -1 });
    
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update activity record
router.put('/residents/:residentId/activities/:recordId', protect, async (req, res) => {
  try {
    const { activities } = req.body;
    
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ message: 'Invalid activities data' });
    }

    const activity = activities[0];
    
    // Find and update the existing record
    const existingRecord = await ActivitiesRecord.findOne({
      residentId: req.params.residentId,
      _id: req.params.recordId
    });

    if (!existingRecord) {
      return res.status(404).json({ message: 'Activity record not found' });
    }

    // Update the record with new data
    Object.assign(existingRecord, activity);
    await existingRecord.save();
    
    res.json({ 
      message: 'Activity record updated successfully',
      activitiesRecord: existingRecord 
    });
  } catch (error) {
    console.error('Activity Update Error:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;