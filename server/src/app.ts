import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { validateCode } from './controllers/validationController';
import { detectLanguage } from './services/languageDetector';

import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

// Security middleware
app.use(limiter);

app.use(cors());
app.use(bodyParser.json({ limit: '100kb' })); // Limit input size

app.post('/validate', validateCode);

app.post('/detect', (req, res) => {
    const { code } = req.body;
    if (typeof code !== 'string') {
        res.status(400).json({ error: 'Missing code' });
        return;
    }
    const language = detectLanguage(code);
    res.json({ language });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
