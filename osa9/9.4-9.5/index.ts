import express from 'express';
import { calculateBmi } from './bmicalculator';

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (!height || !weight || isNaN(height) || isNaN(weight)) {
        res.status(400).json({ error: "Invalid parameters" });
    }

    const bmiResult = calculateBmi(height, weight);

    res.json({
        weight,
        height,
        bmi: bmiResult
    });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});