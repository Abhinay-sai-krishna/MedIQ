import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import Ward from '../models/Ward.model.js';
import Patient from '../models/Patient.model.js';
import User from '../models/User.model.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', authorize('admin'), async (req, res) => {
  try {
    const [wards, patients, staff] = await Promise.all([
      Ward.find(),
      Patient.find(),
      User.find({ role: { $in: ['doctor', 'nurse'] }, isActive: true })
    ]);

    const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
    const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
    const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

    const riskDistribution = {
      low: patients.filter(p => p.riskLevel === 'low').length,
      medium: patients.filter(p => p.riskLevel === 'medium').length,
      high: patients.filter(p => p.riskLevel === 'high').length,
      critical: patients.filter(p => p.riskLevel === 'critical').length
    };

    res.json({
      overview: {
        totalWards: wards.length,
        totalBeds,
        occupiedBeds,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        totalPatients: patients.length,
        totalStaff: staff.length
      },
      wards: wards.map(ward => ({
        name: ward.name,
        type: ward.type,
        occupancy: ward.occupancyRate,
        status: ward.status,
        totalBeds: ward.totalBeds,
        occupiedBeds: ward.occupiedBeds
      })),
      riskDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/wards
// @desc    Get all wards with details
// @access  Private (Admin)
router.get('/wards', authorize('admin'), async (req, res) => {
  try {
    const wards = await Ward.find().populate('staff.userId', 'firstName lastName email role');
    res.json({ wards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/staff
// @desc    Get all staff
// @access  Private (Admin)
router.get('/staff', authorize('admin'), async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['doctor', 'nurse'] },
      isActive: true
    }).select('-password');

    res.json({ staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/login-status
// @desc    Get login status of all users
// @access  Private (Admin)
router.get('/login-status', authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('email role firstName lastName lastLogin createdAt isActive')
      .sort({ lastLogin: -1 });

    const loginStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      loggedInToday: users.filter(u => {
        if (!u.lastLogin) return false;
        const today = new Date();
        const lastLogin = new Date(u.lastLogin);
        return lastLogin.toDateString() === today.toDateString();
      }).length,
      neverLoggedIn: users.filter(u => !u.lastLogin).length,
      users: users.map(user => ({
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`,
        lastLogin: user.lastLogin || 'Never',
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    };

    res.json(loginStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/risk-heatmap
// @desc    Get system-wide risk heatmap
// @access  Private (Admin)
router.get('/risk-heatmap', authorize('admin'), async (req, res) => {
  try {
    const wards = await Ward.find();
    
    const heatmapData = wards.map(ward => ({
      name: ward.name,
      occupancy: ward.occupancyRate,
      risk: ward.status,
      totalBeds: ward.totalBeds,
      occupiedBeds: ward.occupiedBeds
    }));

    res.json({ heatmap: heatmapData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
