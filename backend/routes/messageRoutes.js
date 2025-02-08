// routes/messageRoutes.js
import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get conversations for current user
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user._id] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          user: {
            _id: '$userDetails._id',
            fullName: '$userDetails.fullName',
            userType: '$userDetails.userType'
          },
          lastMessage: {
            content: '$lastMessage.content',
            timestamp: '$lastMessage.timestamp',
            isRead: '$lastMessage.isRead'
          },
          unreadCount: {
            $cond: [
              {
                $and: [
                  { $eq: ['$lastMessage.receiverId', req.user._id] },
                  { $eq: ['$lastMessage.isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get messages between two users
router.get('/messages/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    })
    .sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: req.params.userId,
        receiverId: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});


// Send a new message
router.post('/messages', protect, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId,
      content: content.trim(),
      isRead: false
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Mark messages as delivered
router.put('/messages/deliver/:senderId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.senderId,
        receiverId: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as delivered' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
});

router.put('/messages/read/:senderId', protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        senderId: req.params.senderId,
        receiverId: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
});

export default router;