import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import Patient from '../models/Patient.model.js';
import Ward from '../models/Ward.model.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/doctor/patients
// @desc    Get all patients assigned to doctor
// @access  Private (Doctor)
router.get('/patients', authorize('doctor'), async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.user._id })
      .populate('userId', 'firstName lastName email')
      .sort({ riskLevel: -1, riskScore: -1 });

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/doctor/patients/:patientId
// @desc    Get specific patient details
// @access  Private (Doctor)
router.get('/patients/:patientId', authorize('doctor'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId)
      .populate('userId', 'firstName lastName email')
      .populate('assignedNurse', 'firstName lastName email');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/doctor/risk-heatmap
// @desc    Get risk heatmap data
// @access  Private (Doctor)
router.get('/risk-heatmap', authorize('doctor'), async (req, res) => {
  try {
    const wards = await Ward.find().populate('beds.patientId');
    
    const heatmapData = wards.map(ward => ({
      name: ward.name,
      occupancy: ward.occupancyRate,
      risk: ward.status,
      highRiskPatients: ward.beds
        .filter(bed => bed.patientId)
        .length
    }));

    res.json({ heatmap: heatmapData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/doctor/alerts
// @desc    Get critical alerts
// @access  Private (Doctor)
router.get('/alerts', authorize('doctor'), async (req, res) => {
  try {
    const patients = await Patient.find({
      assignedDoctor: req.user._id,
      'alerts.severity': { $in: ['warning', 'critical'] },
      'alerts.acknowledged': false
    });

    const alerts = [];
    patients.forEach(patient => {
      patient.alerts.forEach(alert => {
        if (!alert.acknowledged && ['warning', 'critical'].includes(alert.severity)) {
          alerts.push({
            patientId: patient._id,
            patientName: `${patient.userId?.firstName} ${patient.userId?.lastName}`,
            ...alert.toObject()
          });
        }
      });
    });

    res.json({ alerts: alerts.sort((a, b) => b.timestamp - a.timestamp) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/doctor/patients/:patientId/reports
// @desc    Add or update patient report
// @access  Private (Doctor)
router.post('/patients/:patientId/reports', authorize('doctor'), async (req, res) => {
  try {
    const { title, type, summary, status, date } = req.body;
    const patient = await Patient.findById(req.params.patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if doctor is assigned to this patient
    if (patient.assignedDoctor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this patient' });
    }

    // Create new report
    const newReport = {
      title,
      type: type || 'other',
      summary: summary || '',
      status: status || 'pending',
      date: date ? new Date(date) : new Date(),
      createdBy: req.user._id,
      updatedAt: new Date()
    };

    patient.reports.push(newReport);
    await patient.save();

    const savedReport = patient.reports[patient.reports.length - 1];
    await savedReport.populate('createdBy', 'firstName lastName');

    res.status(201).json({
      message: 'Report added successfully',
      report: savedReport
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/doctor/patients/:patientId/reports/:reportId
// @desc    Update existing patient report
// @access  Private (Doctor)
router.put('/patients/:patientId/reports/:reportId', authorize('doctor'), async (req, res) => {
  try {
    const { title, summary, status, date } = req.body;
    const patient = await Patient.findById(req.params.patientId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if doctor is assigned to this patient
    if (patient.assignedDoctor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this patient' });
    }

    const report = patient.reports.id(req.params.reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Update report fields
    if (title) report.title = title;
    if (summary !== undefined) report.summary = summary;
    if (status) report.status = status;
    if (date) report.date = new Date(date);
    report.updatedAt = new Date();

    await patient.save();
    await report.populate('createdBy', 'firstName lastName');

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

