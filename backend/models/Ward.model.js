import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  }
});

const wardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['ICU', 'General', 'Emergency', 'Operating', 'Recovery'],
    required: true
  },
  beds: [bedSchema],
  totalBeds: {
    type: Number,
    required: true
  },
  occupiedBeds: {
    type: Number,
    default: 0
  },
  staff: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['doctor', 'nurse']
    },
    shift: {
      type: String,
      enum: ['morning', 'afternoon', 'night']
    }
  }],
  occupancyRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Calculate occupancy rate before saving
wardSchema.pre('save', function(next) {
  if (this.beds && this.totalBeds > 0) {
    this.occupiedBeds = this.beds.filter(bed => bed.status === 'occupied').length;
    this.occupancyRate = (this.occupiedBeds / this.totalBeds) * 100;
    
    // Set status based on occupancy
    if (this.occupancyRate >= 95) {
      this.status = 'critical';
    } else if (this.occupancyRate >= 85) {
      this.status = 'warning';
    } else {
      this.status = 'normal';
    }
  }
  next();
});

const Ward = mongoose.model('Ward', wardSchema);

export default Ward;

