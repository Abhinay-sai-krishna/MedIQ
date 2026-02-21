/**
 * Script to add phone numbers to existing users
 * Usage: node scripts/add-phone-numbers.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

// Sample phone numbers (replace with real numbers for testing)
const SAMPLE_PHONES = {
  doctor: '+14155551001',
  nurse: '+14155551002',
  admin: '+14155551003',
  patient: '+14155551004'
};

async function addPhoneNumbers() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});

    if (users.length === 0) {
      console.log('⚠️  No users found. Create users first.');
      process.exit(0);
    }

    console.log(`📱 Found ${users.length} users`);

    let updated = 0;

    // Add phone numbers to users without them
    for (const user of users) {
      if (!user.profile?.phoneNumber) {
        // Use sample phone based on role, or generate a placeholder
        const phoneNumber = SAMPLE_PHONES[user.role] || `+1415555${String(1000 + updated).padStart(4, '0')}`;
        
        if (!user.profile) {
          user.profile = {};
        }
        
        user.profile.phoneNumber = phoneNumber;
        await user.save();
        updated++;
        
        console.log(`✅ Added phone ${phoneNumber} to ${user.role} ${user.firstName} ${user.lastName}`);
      } else {
        console.log(`⏭️  ${user.role} ${user.firstName} ${user.lastName} already has phone: ${user.profile.phoneNumber}`);
      }
    }

    console.log(`\n✅ Updated ${updated} users with phone numbers`);
    console.log('\n⚠️  NOTE: These are sample phone numbers. Replace with real numbers for production!');
    console.log('   Update phone numbers in MongoDB or via API endpoints.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
addPhoneNumbers();
