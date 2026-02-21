import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.model.js';

dotenv.config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';

(async ()=>{
  try{
    await mongoose.connect(uri);
    console.log('Connected to', mongoose.connection.name);
    const u = new User({
      email: 'manual1@example.com',
      password: 'password123',
      role: 'doctor',
      firstName: 'Manual',
      lastName: 'User',
      profile: { phoneNumber: '+15551234570' }
    });
    await u.save();
    console.log('Saved user', u.email, u._id);
    await mongoose.disconnect();
  }catch(err){
    console.error('ERROR:', err);
    process.exit(1);
  }
})();
