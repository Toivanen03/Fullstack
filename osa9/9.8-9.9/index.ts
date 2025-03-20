import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors(), express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.get('/api/patients', (_req, res) => {
    res.send(null);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});