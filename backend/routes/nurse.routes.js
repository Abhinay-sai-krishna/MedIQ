import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import Patient from '../models/Patient.model.js';
import Ward from '../models/Ward.model.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/nurse/ward
// @desc    Get nurse's assigned ward
// @access  Private (Nurse)
router.get('/ward', authorize('nurse'), async (req, res) => {
  try {
    const ward = await Ward.findOne({
      'staff.userId': req.user._id,
      'staff.role': 'nurse'
    }).populate('beds.patientId', 'currentVitals riskLevel');

    if (!ward) {
      return res.status(404).json({ error: 'Ward not found' });
    }

    res.json({ ward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/nurse/patients
// @desc    Get patients assigned to nurse
// @access  Private (Nurse)
router.get('/patients', authorize('nurse'), async (req, res) => {
  try {
    const patients = await Patient.find({ assignedNurse: req.user._id })
      .populate('userId', 'firstName lastName email')
      .sort({ riskLevel: -1 });

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/nurse/tasks
// @desc    Get nurse tasks (medications, vitals checks)
// @access  Private (Nurse)
router.get('/tasks', authorize('nurse'), async (req, res) => {
  try {
    const patients = await Patient.find({ assignedNurse: req.user._id });

    const tasks = [];
    const now = new Date();

    patients.forEach(patient => {
      // Medication tasks
      patient.medications.forEach(med => {
        med.schedule.forEach(scheduledTime => {
          if (scheduledTime <= now && med.status === 'active') {
            tasks.push({
              type: 'medication',
              patientId: patient._id,
              patientName: `${patient.userId?.firstName} ${patient.userId?.lastName}`,
              medication: med.name,
              dosage: med.dosage,
              scheduledTime,
              priority: 'high'
            });
          }
        });
      });

      // Vitals check tasks (if vitals are old)
      if (patient.currentVitals) {
        const vitalsAge = now - new Date(patient.currentVitals.timestamp);
        const hoursSinceUpdate = vitalsAge / (1000 * 60 * 60);
        
        if (hoursSinceUpdate > 4) {
          tasks.push({
            type: 'vitals',
            patientId: patient._id,
            patientName: `${patient.userId?.firstName} ${patient.userId?.lastName}`,
            lastUpdate: patient.currentVitals.timestamp,
            priority: 'medium'
          });
        }
      }
    });

    res.json({ tasks: tasks.sort((a, b) => b.priority.localeCompare(a.priority)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

