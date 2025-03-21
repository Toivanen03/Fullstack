import express from 'express';
import cors from 'cors';

import diagnosisRouter from './routes/diagnosisRouter';
import patientsRouter from './routes/patientsRouter';

const app = express();
app.use(cors(), express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/patients', patientsRouter);
app.use('/api/diagnoses', diagnosisRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});