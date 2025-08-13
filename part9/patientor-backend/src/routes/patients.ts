import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';
const router = express.Router();

router.get('/', (_req, res) => {
res.json(patientService.getNonSensitive());
});

router.get('/:id', (req, res) => {
const patient = patientService.getById(req.params.id);
if (!patient) return res.status(404).send({ error: 'not found' });
res.json(patient);
});

router.post('/', (req, res) => {
try {
const newPatient = toNewPatient(req.body);
const added = patientService.addPatient(newPatient);
res.status(201).json(added);
} catch (e) {
res.status(400).json({ error: (e as Error).message });
}
});

router.post('/:id/entries', (req, res) => {
try {
const newEntry = toNewEntry(req.body);
const added = patientService.addEntry(req.params.id, newEntry);
if (!added) return res.status(404).json({ error: 'patient not found' });
res.status(201).json(added);
} catch (e) {
res.status(400).json({ error: (e as Error).message });
}
});

export default router;