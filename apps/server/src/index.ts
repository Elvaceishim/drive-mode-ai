import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import sttRouter from './routes/stt';
import parseRouter from './routes/parse';
import gmailRouter from './routes/gmail';
import calendarRouter from './routes/calendar';
import authRouter from './routes/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/stt', sttRouter);
app.use('/parse', parseRouter);
app.use('/gmail', gmailRouter);
app.use('/calendar', calendarRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Drive Mode AI server running on port ${PORT}`);
});
