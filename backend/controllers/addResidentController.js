import Resident from '../models/AddResident.js';

class AddResidentController {
  async addResident(req, res) {
    try {
      const {
        fullName,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactEmail,
        emergencyContactRelation
      } = req.body;

      // Create new resident
      const resident = await Resident.create({
        fullName,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          email: emergencyContactEmail,
          relation: emergencyContactRelation
        },
        createdBy: req.user._id
      });

      // Removed notification creation for now

      res.status(201).json({
        success: true,
        resident
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: messages
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error adding resident',
          error: error.message
        });
      }
    }
  }

  // Helper method to validate resident data
  validateResidentData(data) {
    const requiredFields = [
      'fullName',
      'dateOfBirth',
      'gender',
      'contactNumber',
      'address',
      'emergencyContactName',
      'emergencyContactPhone',
      'emergencyContactEmail',
      'emergencyContactRelation'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        errors: missingFields.map(field => `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`)
      };
    }

    return { isValid: true };
  }
}

export default new AddResidentController();