import express from 'express';
import cors from 'cors';
import calculateBmi from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(cors());
app.use(express.json());

app.get('/hello', (_req, res) => {
res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
const height = Number(req.query.height);
const weight = Number(req.query.weight);
if (!height || !weight || isNaN(height) || isNaN(weight)) {
return res.status(400).json({ error: 'malformatted parameters' });
}
const bmi = calculateBmi(height, weight);
res.json({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const body: any = req.body;
if (!body || body.daily_exercises === undefined || body.target === undefined) {
return res.status(400).json({ error: 'parameters missing' });
}
const target = Number(body.target);
const hours = Array.isArray(body.daily_exercises) ? body.daily_exercises.map(Number) : [];
if (isNaN(target) || hours.some((n: number) => isNaN(n))) {
return res.status(400).json({ error: 'malformatted parameters' });
}
const result = calculateExercises(hours, target);
res.json(result);
});

const PORT = 3003;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});