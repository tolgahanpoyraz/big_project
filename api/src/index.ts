import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT ?? 5001;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/bigproject';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

async function start(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

void start();
