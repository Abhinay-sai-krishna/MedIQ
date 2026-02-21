import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured. Please set it in your .env file.');
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor', 'nurse', 'admin']),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phoneNumber').optional().custom((value, { req }) => {
    // If role is doctor or nurse, phone number is required
    if ((req.body.role === 'doctor' || req.body.role === 'nurse') && !value) {
      throw new Error('Phone number is required for doctors and nurses');
    }
    // If provided, validate format (E.164: +1234567890)
    if (value && !/^\+[1-9]\d{1,14}$/.test(value)) {
      throw new Error('Phone number must be in E.164 format (e.g., +1234567890)');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, firstName, lastName, phoneNumber, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate phone number for doctors and nurses (required for emergency alerts)
    let formattedPhone = phoneNumber;
    if (phoneNumber) {
      // Ensure phone number is in E.164 format (starts with +)
      if (!phoneNumber.startsWith('+')) {
        // If no country code, assume US (+1)
        formattedPhone = `+1${phoneNumber.replace(/\D/g, '')}`;
      } else {
        formattedPhone = `+${phoneNumber.replace(/\D/g, '').replace(/^\+/, '')}`;
      }
    } else if (role === 'doctor' || role === 'nurse') {
      return res.status(400).json({ 
        error: 'Phone number is required for doctors and nurses to receive emergency SMS alerts' 
      });
    }

    // Create profile with phone number
    const userProfile = {
      ...(profile || {}),
      phoneNumber: formattedPhone || profile?.phoneNumber
    };

    // Create new user
    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      profile: userProfile
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.profile?.phoneNumber || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('phoneNumber').optional().custom((value) => {
    // If provided, validate format (E.164: +1234567890)
    if (value && !/^\+[1-9]\d{1,14}$/.test(value)) {
      throw new Error('Phone number must be in E.164 format (e.g., +1234567890)');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, phoneNumber } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update phone number if provided (for doctors and nurses)
    if (phoneNumber && (user.role === 'doctor' || user.role === 'nurse')) {
      let formattedPhone = phoneNumber.trim();
      // Ensure phone number is in E.164 format (starts with +)
      if (!formattedPhone.startsWith('+')) {
        // If no country code, assume US (+1)
        const digits = formattedPhone.replace(/\D/g, '');
        formattedPhone = `+1${digits}`;
      } else {
        // Clean up: remove all non-digits except the leading +
        formattedPhone = `+${formattedPhone.replace(/\D/g, '').replace(/^\+/, '')}`;
      }
      
      if (!user.profile) {
        user.profile = {};
      }
      user.profile.phoneNumber = formattedPhone;
      console.log(`📱 Updated phone number for ${user.role} ${user.email}: ${formattedPhone}`);
    } else if ((user.role === 'doctor' || user.role === 'nurse') && !user.profile?.phoneNumber) {
      // Warn if doctor/nurse doesn't have phone number
      console.warn(`⚠️  ${user.role} ${user.email} logged in without phone number. Emergency SMS alerts will not be sent.`);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        lastLogin: user.lastLogin,
        phoneNumber: user.profile?.phoneNumber || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

