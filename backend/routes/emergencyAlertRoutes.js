import express from 'express';
import EmergencyAlert from '../models/EmergencyAlert.js';
import User from '../models/User.js';
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

const createEmailTemplate = (residentName, message, timestamp, emergencyContact = null) => {
  const formattedTime = new Date(timestamp || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Singapore'
  });

  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #ff4d5a 100%); padding: 20px; border-radius: 10px;">
          <h1 style="color: white; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">
            Emergency Alert
          </h1>
        </div>
      </div>

      <!-- Alert Content -->
      <div style="background-color: #fff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px; overflow: hidden;">
        <!-- Alert Header -->
        <div style="background-color: #f8d7da; padding: 20px; border-bottom: 1px solid #f5c6cb;">
          <h2 style="color: #721c24; margin: 0; font-size: 20px;">
            ⚠️ Urgent Alert for ${residentName}
          </h2>
        </div>

        <!-- Alert Body -->
        <div style="padding: 20px;">
          <div style="margin-bottom: 20px;">
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 15px;">
              <strong style="color: #721c24;">Alert Message:</strong><br>
              ${message}
            </p>
            <p style="font-size: 14px; color: #666; margin: 0;">
              <strong>Time:</strong> ${formattedTime}
            </p>
          </div>

          ${emergencyContact ? `
          <!-- Emergency Contact Information -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <h3 style="color: #495057; margin: 0 0 15px; font-size: 16px;">Emergency Contact Details</h3>
            <div style="font-size: 14px; color: #666;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${emergencyContact.name || 'Not provided'}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${emergencyContact.phone || 'Not provided'}</p>
              <p style="margin: 5px 0;"><strong>Relation:</strong> ${emergencyContact.relation || 'Not specified'}</p>
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Action Required Notice -->
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <p style="color: #856404; margin: 0; font-size: 15px;">
          <strong>⚡ Immediate Action Required:</strong><br>
          Please check the LIFEEC application for complete details and required actions.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; margin: 0;">
          This is an automated emergency alert from LIFEEC Alert System.<br>
          Please do not reply to this email.
        </p>
        <div style="margin-top: 15px;">
          <p style="color: #999; font-size: 11px; margin: 0;">
            &copy; ${new Date().getFullYear()} LIFEEC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;
};

async function sendEmergencyEmails(alert, recipientEmails) {
  const emailPromises = recipientEmails.map(email => {
    return transporter.sendMail({
      from: {
        name: 'LIFEEC Emergency Alerts',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `🚨 URGENT: Emergency Alert for ${alert.residentName}`,
      html: createEmailTemplate(
        alert.residentName,
        alert.message,
        alert.timestamp,
        alert.emergencyContact
      ),
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
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
      message: message || `Emergency alert triggered for ${residentName}`,
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