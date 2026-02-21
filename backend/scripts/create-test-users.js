import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';

const testUsers = [
  {
    email: 'doctor@mediq.com',
    password: 'password123',
    role: 'doctor',
    firstName: 'John',
    lastName: 'Doe',
    profile: {
      employeeId: 'DOC001',
      department: 'Cardiology',
      specialization: 'Cardiologist'
    }
  },
  {
    email: 'nurse@mediq.com',
    password: 'password123',
    role: 'nurse',
    firstName: 'Sarah',
    lastName: 'Johnson',
    profile: {
      employeeId: 'NUR001',
      ward: 'ICU North'
    }
  },
  {
    email: 'patient@mediq.com',
    password: 'password123',
    role: 'patient',
    firstName: 'Jane',
    lastName: 'Smith',
    profile: {
      patientId: 'PAT001',
      phoneNumber: '+1234567890'
    }
  },
  {
    email: 'admin@mediq.com',
    password: 'password123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  }
];

async function createTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB!\n');

    // Clear existing test users (optional)
    const existingEmails = testUsers.map(u => u.email);
    const deleted = await User.deleteMany({ email: { $in: existingEmails } });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Deleted ${deleted.deletedCount} existing test users\n`);
    }

    // Create test users
    console.log('👥 Creating test users...\n');
    const createdUsers = [];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created: ${userData.email} (${userData.role})`);
    }

    console.log(`\n🎉 Successfully created ${createdUsers.length} test users!\n`);

    // Display login credentials
    console.log('📋 Login Credentials:\n');
    console.log('═'.repeat(60));
    testUsers.forEach(user => {
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log('─'.repeat(60));
    });

    console.log('\n📍 View in MongoDB Compass:');
    console.log('   1. Connect to: mongodb://localhost:27017');
    console.log('   2. Open database: mediq');
    console.log('   3. Open collection: users');
    console.log('\n🌐 Or use API:');
    console.log('   GET http://localhost:5000/api/test/users');

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n📝 Make sure:');
    console.error('   1. MongoDB is running');
    console.error('   2. .env file has correct MONGODB_URI');
    process.exit(1);
  }
}

createTestUsers();


