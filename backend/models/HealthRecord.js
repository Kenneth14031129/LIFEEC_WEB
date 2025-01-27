// models/HealthRecord.js
import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  allergies: String,
  medicalCondition: String,
  medications: String,
  dosage: String,
  quantity: String,
  medicationTime: String,
  isMedicationTaken: Boolean,
  assessment: String,
  instructions: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;