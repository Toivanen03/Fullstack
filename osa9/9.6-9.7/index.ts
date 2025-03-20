import express from 'express';
import { calculateBmi } from './bmicalculator';
import { calculateExercises } from './exerciseCalculator';

interface RequestBody {
  daily_exercises: number[];
  target: number;
};

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "Invalid parameters" });
  };

  const bmiResult = calculateBmi(height, weight);

  res.json({
    weight,
    height,
    bmi: bmiResult
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target }: RequestBody = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
  };

  if (!Array.isArray(daily_exercises) || !daily_exercises.every(e => typeof e === 'number') || 
    typeof target !== 'number')
  {
    res.status(400).json({ error: 'malformatted parameters' });
  };

  const result = calculateExercises(target, daily_exercises);
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});