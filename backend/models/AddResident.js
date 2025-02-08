import mongoose from 'mongoose';

const residentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relation: {
      type: String,
      required: [true, 'Relationship to resident is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    },
    email: {
      type: String,
      required: [true, 'Emergency contact email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'temporary_leave'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const AddResident = mongoose.model('Resident', residentSchema);
export default AddResident;