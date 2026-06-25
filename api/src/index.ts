import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use(errorHandler);

async function start(): Promise<void> {
    try {
        await connectDB();
        app.listen(config.port, () => {
            console.log(`API listening on http://localhost:${config.port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

void start();
