import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending', index: true },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
