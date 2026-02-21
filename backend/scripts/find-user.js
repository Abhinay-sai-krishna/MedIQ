import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.model.js';

dotenv.config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediq';
const email = process.env.EMAIL || 'api-debug2@example.com';

(async ()=>{
  try{
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', mongoose.connection.name);
    const u = await User.findOne({ email }).lean();
    if(u) console.log('FOUND USER:', u.email, u.role, u._id);
    else console.log('USER NOT FOUND:', email);
    await mongoose.disconnect();
  }catch(err){
    console.error('ERROR:', err);
    process.exit(1);
  }
})();
