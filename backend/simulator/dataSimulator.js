import mongoose from 'mongoose';
import Patient from '../models/Patient.model.js';
import User from '../models/User.model.js';
import { generatePatientVitals, generateMultipleVitals } from './vitalsGenerator.js';
import { calculateRiskScore, isDangerous } from './riskCalculator.js';
import { generateAllWardOccupancy, getWardOccupancyPercent } from './wardOccupancySimulator.js';
import { sendPatientAlert, sendWardOverloadAlert } from '../services/alertService.js';

/**
 * Data Simulator
 * Main simulator that generates patient vitals, saves to MongoDB, and emits via WebSocket
 */
class DataSimulator {
  constructor(io) {
    this.io = io;
    this.intervalId = null;
    this.isRunning = false;
    this.patientIds = []; // Track existing patient IDs
    this.intervalMs = 4000; // Default: 4 seconds (between 3-5 seconds)
    this.lastAlertTimes = new Map(); // Track last alert time per patient/ward to avoid spam
    this.alertCooldownMs = 300000; // 5 minutes cooldown between alerts for same patient/ward
  }

  /**
   * Initialize simulator - create or fetch existing patients
   */
  async initialize() {
    try {
      // Get or create test users for patients
      const users = await User.find({ role: 'patient' }).limit(10);
      
      if (users.length === 0) {
        console.log('⚠️  No patient users found. Simulator will create patient records without userId.');
      } else {
        // Store user IDs for patient assignment
        this.userIds = users.map(u => u._id);
        console.log(`✅ Found ${users.length} patient users for simulation`);
      }

      // Get existing patients
      const existingPatients = await Patient.find().limit(20);
      this.patientIds = existingPatients.map(p => p.patientId);
      
      console.log(`✅ Simulator initialized with ${this.patientIds.length} existing patients`);
    } catch (error) {
      console.error('❌ Error initializing simulator:', error);
    }
  }

  /**
   * Generate and save patient vitals
   */
  async generateAndSaveVitals() {
    try {
      // Generate ward occupancy data
      const wardOccupancy = generateAllWardOccupancy();

      // Generate vitals for 5-10 patients
      const patientCount = Math.floor(Math.random() * 6) + 5; // 5-10 patients
      const vitalsData = generateMultipleVitals(patientCount);

      // Process each patient's vitals
      for (const vitals of vitalsData) {
        await this.processPatientVitals(vitals, wardOccupancy[vitals.ward]?.occupancyPercent || 0);
      }

      // Check for ward overload and send alerts
      for (const [wardName, wardData] of Object.entries(wardOccupancy)) {
        if (wardData.occupancyPercent > 90) {
          await this.checkAndSendWardOverloadAlert(wardName, wardData);
        }
      }

      // Emit ward occupancy data
      this.io.emit('ward-occupancy', wardOccupancy);

      console.log(`📊 Generated vitals for ${patientCount} patients`);
    } catch (error) {
      console.error('❌ Error generating vitals:', error);
    }
  }

  /**
   * Process individual patient vitals
   * @param {Object} vitals - Patient vitals data
   * @param {number} wardOccupancy - Ward occupancy percentage
   */
  async processPatientVitals(vitals, wardOccupancy) {
    try {
      // Calculate risk score
      const riskData = calculateRiskScore(vitals, wardOccupancy);
      const danger = isDangerous(vitals);

      // Prepare vital signs object for database
      const vitalSigns = {
        heartRate: vitals.heartRate,
        bloodPressure: {
          systolic: vitals.bloodPressureObj.systolic,
          diastolic: vitals.bloodPressureObj.diastolic
        },
        oxygenSaturation: vitals.oxygenSaturation,
        respiratoryRate: vitals.respiratoryRate,
        temperature: vitals.temperature,
        timestamp: vitals.timestamp
      };

      // Find or create patient
      let patient = await Patient.findOne({ patientId: vitals.patientId });

      if (!patient) {
        // Create new patient if doesn't exist
        // Assign random user if available, otherwise create without userId
        const userId = this.userIds && this.userIds.length > 0
          ? this.userIds[Math.floor(Math.random() * this.userIds.length)]
          : null;

        patient = new Patient({
          patientId: vitals.patientId,
          userId: userId || new mongoose.Types.ObjectId(), // Dummy ObjectId if no users
          assignedWard: vitals.ward,
          vitals: [vitalSigns],
          currentVitals: vitalSigns,
          riskScore: riskData.riskScore,
          riskLevel: riskData.riskLevel
        });

        this.patientIds.push(vitals.patientId);
      } else {
        // Update existing patient
        patient.vitals.push(vitalSigns);
        // Keep only last 50 vitals readings
        if (patient.vitals.length > 50) {
          patient.vitals = patient.vitals.slice(-50);
        }
        patient.currentVitals = vitalSigns;
        patient.riskScore = riskData.riskScore;
        patient.riskLevel = riskData.riskLevel;
        patient.assignedWard = vitals.ward;

        // Add alert if dangerous
        if (danger && !patient.alerts.some(a => !a.acknowledged && a.type === 'vital')) {
          patient.alerts.push({
            type: 'vital',
            message: `Critical vitals detected: ${riskData.reasons.join('; ')}`,
            severity: riskData.riskLevel === 'critical' ? 'critical' : 'warning',
            acknowledged: false
          });
        }
      }

      await patient.save();

      // Send SMS alert if critical conditions detected
      await this.checkAndSendPatientAlert(vitals, riskData, wardOccupancy);

      // Prepare data for WebSocket emission
      const emitData = {
        type: 'vitals',
        payload: {
          patientId: vitals.patientId,
          heartRate: vitals.heartRate,
          oxygenSaturation: vitals.oxygenSaturation,
          bloodPressure: vitals.bloodPressure,
          respiratoryRate: vitals.respiratoryRate,
          temperature: vitals.temperature,
          ward: vitals.ward,
          riskScore: riskData.riskScore,
          riskLevel: riskData.riskLevel,
          riskReasons: riskData.reasons,
          danger,
          timestamp: vitals.timestamp
        }
      };

      // Emit to all connected clients
      this.io.emit('vitals-update', emitData);

      // Also emit individual patient update
      this.io.emit(`patient-${vitals.patientId}`, emitData);

    } catch (error) {
      console.error(`❌ Error processing vitals for patient ${vitals.patientId}:`, error);
    }
  }

  /**
   * Start the simulator
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Simulator is already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 Starting data simulator (interval: ${this.intervalMs}ms)`);

    // Generate initial data immediately
    this.generateAndSaveVitals();

    // Then generate at intervals
    this.intervalId = setInterval(() => {
      this.generateAndSaveVitals();
    }, this.intervalMs);
  }

  /**
   * Stop the simulator
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Simulator is not running');
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Data simulator stopped');
  }

  /**
   * Set simulation interval
   * @param {number} ms - Interval in milliseconds
   */
  setInterval(ms) {
    this.intervalMs = ms;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Check and send patient alert if critical conditions detected
   * @param {Object} vitals - Patient vitals
   * @param {Object} riskData - Risk calculation results
   * @param {number} wardOccupancy - Ward occupancy percentage
   */
  async checkAndSendPatientAlert(vitals, riskData, wardOccupancy) {
    try {
      // Check if we should send alert based on thresholds
      const shouldAlert = 
        riskData.riskLevel === 'critical' || // Critical risk
        vitals.oxygenSaturation < 90 || // Low SpO₂
        vitals.heartRate > 120 || // High heart rate
        vitals.heartRate < 50; // Low heart rate

      if (!shouldAlert) {
        return;
      }

      // Check cooldown to avoid spam
      const alertKey = `patient-${vitals.patientId}`;
      const lastAlertTime = this.lastAlertTimes.get(alertKey);
      const now = Date.now();

      if (lastAlertTime && (now - lastAlertTime) < this.alertCooldownMs) {
        return; // Still in cooldown
      }

      // Prepare alert data
      const alertData = {
        patientId: vitals.patientId,
        vitals: {
          oxygenSaturation: vitals.oxygenSaturation,
          heartRate: vitals.heartRate,
          bloodPressure: vitals.bloodPressure,
          respiratoryRate: vitals.respiratoryRate,
          temperature: vitals.temperature
        },
        riskScore: riskData.riskScore,
        riskLevel: riskData.riskLevel,
        reasons: riskData.reasons,
        ward: vitals.ward,
        wardOccupancy: wardOccupancy
      };

      // Determine target roles based on severity
      let targetRoles = ['doctor', 'nurse'];
      if (riskData.riskLevel === 'critical') {
        targetRoles.push('admin'); // Include admins for critical cases
      }

      // Send alert (non-blocking - errors are handled internally)
      const result = await sendPatientAlert(alertData, targetRoles);

      if (result.success) {
        this.lastAlertTimes.set(alertKey, now);
        console.log(`📱 SMS alert sent for patient ${vitals.patientId} (${riskData.riskLevel} risk)`);
      }
    } catch (error) {
      // Don't let SMS errors break the simulator
      console.error(`❌ Error sending patient alert for ${vitals.patientId}:`, error.message);
    }
  }

  /**
   * Check and send ward overload alert
   * @param {string} wardName - Ward name
   * @param {Object} wardData - Ward occupancy data
   */
  async checkAndSendWardOverloadAlert(wardName, wardData) {
    try {
      // Check cooldown
      const alertKey = `ward-${wardName}`;
      const lastAlertTime = this.lastAlertTimes.get(alertKey);
      const now = Date.now();

      if (lastAlertTime && (now - lastAlertTime) < this.alertCooldownMs) {
        return; // Still in cooldown
      }

      // Send alert (non-blocking)
      const result = await sendWardOverloadAlert({
        wardName,
        occupancyPercent: wardData.occupancyPercent,
        totalBeds: wardData.totalBeds,
        occupiedBeds: wardData.occupiedBeds
      });

      if (result.success) {
        this.lastAlertTimes.set(alertKey, now);
        console.log(`📱 SMS alert sent for ward ${wardName} overload (${wardData.occupancyPercent}%)`);
      }
    } catch (error) {
      // Don't let SMS errors break the simulator
      console.error(`❌ Error sending ward overload alert for ${wardName}:`, error.message);
    }
  }
}

export default DataSimulator;
