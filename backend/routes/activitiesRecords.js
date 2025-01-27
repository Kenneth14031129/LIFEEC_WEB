// routes/activitiesRecords.js
import express from 'express';
import ActivitiesRecord from '../models/ActivitiesRecord.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create or Update Activities Record
router.post('/residents/:residentId/activities', protect, async (req, res) => {
  try {
    console.log('Incoming Activities Data:', req.body);
    const { activities } = req.body;

    // Validate input
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ message: 'Invalid activities data' });
    }

    let activitiesRecord = await ActivitiesRecord.findOne({ 
      residentId: req.params.residentId 
    });

    if (activitiesRecord) {
      // Find if an activity for this date already exists
      const existingActivityIndex = activitiesRecord.activities.findIndex(
        a => a.date === activities[0].date
      );

      if (existingActivityIndex !== -1) {
        // Update existing activity
        activitiesRecord.activities[existingActivityIndex] = activities[0];
      } else {
        // Add new activity
        activitiesRecord.activities.push(activities[0]);
      }

      await activitiesRecord.save();
    } else {
      // Create new record
      activitiesRecord = new ActivitiesRecord({
        residentId: req.params.residentId,
        activities: activities
      });
      await activitiesRecord.save();
    }

    res.status(201).json({ 
      message: 'Activities record updated successfully',
      activitiesRecord 
    });
  } catch (error) {
    console.error('Activities Update Error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get Activities Record
router.get('/residents/:residentId/activities', protect, async (req, res) => {
  try {
    const activitiesRecord = await ActivitiesRecord.findOne({ 
      residentId: req.params.residentId 
    });

    if (!activitiesRecord) {
      return res.status(404).json({ message: 'No activities record found' });
    }

    res.json({ activities: activitiesRecord.activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;