import express from 'express';
import { errorMiddleware } from './middleware/errorHandler';
import cors from 'cors';

import diagnosisRouter from './routes/diagnosisRouter';
import patientsRouter from './routes/patientsRouter';

const app = express();

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use(cors());
app.use(express.json());
app.use('/api/patients', patientsRouter);
app.use('/api/diagnoses', diagnosisRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});