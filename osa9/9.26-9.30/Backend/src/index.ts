import express from 'express';
import { errorMiddleware } from './middleware/errorHandler';
import cors from 'cors';
import diagnosisRouter from './routes/diagnosisRouter';
import patientsRouter from './routes/patientsRouter';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/patients', patientsRouter);
app.use('/diagnoses', diagnosisRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});