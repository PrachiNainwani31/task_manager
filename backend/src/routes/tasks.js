import { Router } from 'express';
import Task from '../models/Task.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.use(authRequired);

// List tasks
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query; // pending | completed
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const tasks = await Task.find(where).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (e) { next(e); }
});

// Create task
router.post('/', async (req, res, next) => {
  try {
    const { title, description = '', dueDate } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({ error: 'Due date already expired. Please enter a valid date.' });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });
    res.status(201).json({ task });
  } catch (e) { next(e); }
});

// Update task
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({ error: 'Due date already expired. Please enter a valid date.' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  } catch (e) { next(e); }
});

// Toggle
router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();
    res.json({ task });
  } catch (e) { next(e); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
