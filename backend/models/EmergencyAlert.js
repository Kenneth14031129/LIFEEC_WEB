import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  residentName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    default: "Emergency alert triggered",
  },
  emergencyContact: {
    name: String,
    phone: String,
    email: String,
    relation: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false
  },
});

export default mongoose.model('EmergencyAlert', emergencyAlertSchema);