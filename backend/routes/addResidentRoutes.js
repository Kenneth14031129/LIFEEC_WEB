import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import AddResidentController from '../controllers/addResidentController.js';

const router = express.Router();

// POST /api/residents/add
router.post('/add', protect, AddResidentController.addResident);

export default router;
