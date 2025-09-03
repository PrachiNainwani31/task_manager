import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'task_manager' });
  console.log('Connected to MongoDB');
}
