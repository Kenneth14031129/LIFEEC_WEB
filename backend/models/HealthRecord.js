// models/HealthRecord.js
import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dosage: String,
  quantity: String,
  medicationTime: String,
  isMedicationTaken: {
    type: Boolean,
    default: false
  }
});

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
    required: true,
    enum: ['Stable', 'Critical']
  },
  allergies: [{
    type: String
  }],
  medicalCondition: [{
    type: String
  }],
  medications: [medicationSchema],
  assessment: String,
  instructions: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
export default HealthRecord;