// models/ActivitiesRecord.js
import mongoose from 'mongoose';

const activitiesRecordSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  duration: Number,
  location: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ActivitiesRecord = mongoose.model('ActivitiesRecord', activitiesRecordSchema);
export default ActivitiesRecord;