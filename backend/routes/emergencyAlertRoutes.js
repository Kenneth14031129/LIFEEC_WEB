import express from 'express';
import EmergencyAlert from '../models/EmergencyAlert.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
      const { residentId, residentName, message, emergencyContact } = req.body;
      
      console.log('Creating alert with data:', {
        residentId,
        residentName,
        message,
        emergencyContact
      });
  
      const alert = await EmergencyAlert.create({
        residentId,
        residentName,
        message: message || "Emergency alert triggered",
        emergencyContact,
        timestamp: new Date()
      });
  
      res.status(201).json(alert);
    } catch (error) {
      console.error('Detailed emergency alert creation error:', error);
      res.status(500).json({ 
        message: 'Failed to create emergency alert',
        error: error.message
      });
    }
  });

router.get('/:residentId', protect, async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find({ residentId: req.params.residentId })
      .sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching emergency alerts:', err);
    res.status(500).json({ message: 'Failed to fetch emergency alerts' });
  }
});

router.put('/mark-read', protect, async (req, res) => {
  try {
    const { alertIds } = req.body;
    
    // Update multiple alerts
    await EmergencyAlert.updateMany(
      { _id: { $in: alertIds } },
      { $set: { read: true } }
    );

    res.json({ message: 'Alerts marked as read successfully' });
  } catch (error) {
    console.error('Error marking alerts as read:', error);
    res.status(500).json({ message: 'Failed to mark alerts as read' });
  }
});

export default router;