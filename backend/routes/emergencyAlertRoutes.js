import express from 'express';
import EmergencyAlert from '../models/EmergencyAlert.js';
import User from '../models/User.js'; // Added the missing import
import { protect } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmergencyEmails(alert, recipientEmails) {
  const emailPromises = recipientEmails.map(email => {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "URGENT: Emergency Alert at LIFEEC",
      html: `
        <h1>Emergency Alert</h1>
        <p>An emergency has been reported for resident: <strong>${alert.residentName}</strong></p>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
        <p><strong>Emergency Contact:</strong></p>
        <ul>
          <li>Name: ${alert.emergencyContact.name}</li>
          <li>Phone: ${alert.emergencyContact.phone}</li>
          <li>Relation: ${alert.emergencyContact.relation}</li>
        </ul>
        <p>Please respond according to protocol.</p>
      `
    });
  });

  await Promise.all(emailPromises);
}

router.post('/', protect, async (req, res) => {
  try {
    const { residentId, residentName, message, emergencyContact } = req.body;
    
    // Create the emergency alert
    const alert = await EmergencyAlert.create({
      residentId,
      residentName,
      message: message || "Emergency alert triggered",
      emergencyContact,
      timestamp: new Date()
    });

    // Find all relevant users to notify
    const users = await User.find({
      $or: [
        { userType: 'nurse' },
        { userType: 'admin' },
        { userType: 'owner' }
      ],
      isArchived: { $ne: true }
    });

    // Add the resident's emergency contact email
    const recipientEmails = [
      ...users.map(user => user.email),
      emergencyContact.email // Add emergency contact's email
    ];

    // Send emails to all recipients
    await sendEmergencyEmails(alert, recipientEmails);

    res.status(201).json({
      alert,
      message: 'Emergency alert created and notifications sent successfully'
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
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