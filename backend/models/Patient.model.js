import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
  heartRate: { type: Number, min: 0, max: 300 },
  bloodPressure: {
    systolic: { type: Number, min: 0, max: 300 },
    diastolic: { type: Number, min: 0, max: 200 }
  },
  oxygenSaturation: { type: Number, min: 0, max: 100 },
  respiratoryRate: { type: Number, min: 0, max: 60 },
  temperature: { type: Number, min: 90, max: 110 },
  timestamp: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for simulator-generated patients
  },
  vitals: [vitalSignsSchema],
  currentVitals: {
    type: vitalSignsSchema,
    default: null
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  alerts: [{
    type: {
      type: String,
      enum: ['vital', 'risk', 'medication', 'system']
    },
    message: String,
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical']
    },
    timestamp: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false }
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    schedule: [Date],
    status: {
      type: String,
      enum: ['active', 'completed', 'missed']
    }
  }],
  labResults: [{
    testName: String,
    result: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical']
    }
  }],
  reports: [{
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['xray', 'blood', 'urinalysis', 'mri', 'ct', 'ultrasound', 'other'],
      default: 'other'
    },
    date: { type: Date, default: Date.now },
    summary: String,
    status: {
      type: String,
      enum: ['pending', 'ready'],
      default: 'pending'
    },
    pdfUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: { type: Date, default: Date.now }
  }],
  assignedWard: String,
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
patientSchema.index({ userId: 1 });
patientSchema.index({ riskLevel: 1 });
patientSchema.index({ 'currentVitals.timestamp': -1 });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;

