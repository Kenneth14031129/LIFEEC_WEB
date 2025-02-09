// routes/healthRecords.js
import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new health record
router.post('/residents/:residentId/health', protect, async (req, res) => {
  try {
    // Handle both new and old format
    const healthData = {
      ...req.body,
      residentId: req.params.residentId
    };

    // Convert old format to new format if necessary
    if (req.body.medications && typeof req.body.medications === 'string') {
      healthData.medications = [{
        name: req.body.medications,
        dosage: req.body.dosage,
        quantity: req.body.quantity,
        medicationTime: req.body.medicationTime,
        isMedicationTaken: req.body.isMedicationTaken
      }];
      
      // Remove old format fields
      delete healthData.dosage;
      delete healthData.quantity;
      delete healthData.medicationTime;
      delete healthData.isMedicationTaken;
    }

    const healthRecord = new HealthRecord(healthData);
    await healthRecord.save();
    
    res.status(201).json({ healthRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all health records for a resident
router.get('/residents/:residentId/health', protect, async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({ 
      residentId: req.params.residentId 
    }).sort({ createdAt: -1 });

    // Transform records to maintain backward compatibility
    const transformedRecords = healthRecords.map(record => {
      const mainMedication = record.medications?.[0] || {};
      return {
        ...record.toObject(),
        medications: mainMedication.name || '',
        dosage: mainMedication.dosage || '',
        quantity: mainMedication.quantity || '',
        medicationTime: mainMedication.medicationTime || '',
        isMedicationTaken: mainMedication.isMedicationTaken || false,
        allMedications: record.medications // Add new field for multiple medications
      };
    });
    
    res.json({ healthRecords: transformedRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a health record
router.put('/residents/:residentId/health/:recordId', protect, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Convert old format to new format if necessary
    if (updateData.medications && typeof updateData.medications === 'string') {
      updateData.medications = [{
        name: updateData.medications,
        dosage: updateData.dosage,
        quantity: updateData.quantity,
        medicationTime: updateData.medicationTime,
        isMedicationTaken: updateData.isMedicationTaken
      }];
      
      // Remove old format fields
      delete updateData.dosage;
      delete updateData.quantity;
      delete updateData.medicationTime;
      delete updateData.isMedicationTaken;
    }

    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.recordId,
      updateData,
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Transform response to maintain backward compatibility
    const mainMedication = updatedRecord.medications?.[0] || {};
    const transformedRecord = {
      ...updatedRecord.toObject(),
      medications: mainMedication.name || '',
      dosage: mainMedication.dosage || '',
      quantity: mainMedication.quantity || '',
      medicationTime: mainMedication.medicationTime || '',
      isMedicationTaken: mainMedication.isMedicationTaken || false,
      allMedications: updatedRecord.medications
    };
    
    res.json({ healthRecord: transformedRecord });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;