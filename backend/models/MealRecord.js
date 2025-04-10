// models/MealRecord.js
import mongoose from 'mongoose';

const mealRecordSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  dietaryNeeds: String,
  nutritionalGoals: String,
  date: {
    type: String,
    required: true
  },
  breakfast: [String], // Changed to array
  lunch: [String],     // Changed to array
  snacks: [String],    // Changed to array
  dinner: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MealRecord = mongoose.model('MealRecord', mealRecordSchema);
export default MealRecord;