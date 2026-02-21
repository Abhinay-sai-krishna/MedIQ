import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import { sendSMS, sendPatientAlertSMS, sendWardOverloadSMS, isSMSAvailable } from '../services/smsService.js';
import { getStaffPhoneNumbers, sendPatientAlert } from '../services/alertService.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test database connection
router.get('/db', async (req, res) => {
  try {
    const status = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
      status: states[status] || 'unknown',
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test SMS service availability
router.get('/sms/status', (req, res) => {
  res.json({
    available: isSMSAvailable(),
    configured: isSMSAvailable(),
    message: isSMSAvailable() 
      ? 'SMS service is ready' 
      : 'SMS service not configured. Add Twilio credentials to .env file.'
  });
});

// Test SMS sending (requires phone number in query)
router.post('/sms/test', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ 
        error: 'Phone number required',
        example: { phoneNumber: '+1234567890', message: 'Test message' }
      });
    }

    const result = await sendSMS(
      phoneNumber,
      message || '🧪 Test SMS from MedIQ Healthcare Platform. SMS service is working!'
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'SMS sent successfully',
        sid: result.sid,
        status: result.status
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test patient alert SMS
router.post('/sms/test-patient-alert', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ 
        error: 'Phone number required',
        example: { phoneNumber: '+1234567890' }
      });
    }

    // Sample alert data
    const alertData = {
      patientId: 'P101',
      vitals: {
        oxygenSaturation: 85,
        heartRate: 130,
        bloodPressure: '150/95',
        respiratoryRate: 24,
        temperature: 99.5
      },
      riskScore: 75,
      riskLevel: 'critical',
      reasons: [
        'Critical: SpO₂ is dangerously low at 85%',
        'High heart rate detected: 130 bpm',
        'High ward occupancy: 95%'
      ],
      ward: 'ICU North',
      wardOccupancy: 95
    };

    const result = await sendPatientAlertSMS(phoneNumber, alertData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Patient alert SMS sent successfully',
        sid: result.sid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test ward overload alert SMS
router.post('/sms/test-ward-alert', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ 
        error: 'Phone number required',
        example: { phoneNumber: '+1234567890' }
      });
    }

    const wardData = {
      wardName: 'ICU North',
      occupancyPercent: 95,
      totalBeds: 20,
      occupiedBeds: 19
    };

    const result = await sendWardOverloadSMS(phoneNumber, wardData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Ward overload alert SMS sent successfully',
        sid: result.sid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get staff phone numbers
router.get('/sms/staff-phones', async (req, res) => {
  try {
    const { roles, ward } = req.query;
    const roleArray = roles ? roles.split(',') : ['doctor', 'nurse', 'admin'];
    
    const phoneNumbers = await getStaffPhoneNumbers(roleArray, ward);
    
    res.json({
      count: phoneNumbers.length,
      roles: roleArray,
      ward: ward || 'all',
      phoneNumbers: phoneNumbers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger emergency alert for current logged-in user (for testing)
router.post('/sms/trigger-emergency-alert', authenticate, async (req, res) => {
  try {
    const user = req.user;

    // Check if user has phone number
    if (!user.profile?.phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'No phone number found for your account',
        message: 'Please update your phone number in your profile to receive emergency alerts'
      });
    }

    // Check if SMS is available
    if (!isSMSAvailable()) {
      return res.status(400).json({
        success: false,
        error: 'SMS service not configured',
        message: 'Twilio credentials are missing. Check your .env file.'
      });
    }

    // Create sample emergency alert data
    const alertData = {
      patientId: 'P101',
      vitals: {
        oxygenSaturation: 85,  // Critical: below 90%
        heartRate: 130,         // Critical: above 120 bpm
        bloodPressure: '150/95',
        respiratoryRate: 24,
        temperature: 99.5
      },
      riskScore: 75,
      riskLevel: 'critical',
      reasons: [
        'Critical: SpO₂ is dangerously low at 85%',
        'High heart rate detected: 130 bpm',
        'High ward occupancy: 95%'
      ],
      ward: 'ICU North',
      wardOccupancy: 95
    };

    // Send alert to current user's phone number
    const result = await sendPatientAlertSMS(user.profile.phoneNumber, alertData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Emergency alert SMS sent successfully!',
        sentTo: user.profile.phoneNumber,
        sid: result.sid,
        status: result.status,
        alertData: alertData
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        message: 'Failed to send SMS alert',
        sentTo: user.profile.phoneNumber
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get current user's phone number status
router.get('/sms/my-phone-status', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const phoneNumber = user.profile?.phoneNumber;

    res.json({
      hasPhoneNumber: !!phoneNumber,
      phoneNumber: phoneNumber || null,
      role: user.role,
      email: user.email,
      smsAvailable: isSMSAvailable(),
      message: phoneNumber 
        ? 'Phone number is configured. You will receive emergency SMS alerts.'
        : 'No phone number found. Add your phone number to receive emergency alerts.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
