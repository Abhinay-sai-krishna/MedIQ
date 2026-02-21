import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log(`📍 Connection String: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    // Test query
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await User.find().select('email role firstName lastName createdAt').limit(5);
      console.log('\n📋 Sample users:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
      });
    } else {
      console.log('\n💡 No users found. You can register a user via POST /api/auth/register');
    }

    await mongoose.connection.close();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n📝 Troubleshooting:');
    console.error('1. Is MongoDB running?');
    console.error('   - Windows: net start MongoDB');
    console.error('   - Mac/Linux: sudo systemctl start mongod');
    console.error('   - Or check MongoDB Compass/Atlas');
    console.error('2. Check your .env file for MONGODB_URI');
    console.error('3. For local: mongodb://localhost:27017/mediq');
    console.error('4. For Atlas: mongodb+srv://username:password@cluster.mongodb.net/mediq');
    process.exit(1);
  }
}

testConnection();

