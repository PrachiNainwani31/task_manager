import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/db.js';
import authRoutes from './src/routes/auth.js';
import taskRoutes from './src/routes/tasks.js';

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API' });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error('ERR:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const port = process.env.PORT || 4000;

// On Vercel serverless, don't listen if the module is imported; but Vercel will call handler anyway.
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`API listening on :${port}`);
    });
  });
}

export default app;
