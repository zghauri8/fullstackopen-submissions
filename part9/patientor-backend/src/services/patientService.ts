import patients from '../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatient, Patient, NewPatient, Entry, NewEntry } from '../types';
const getNonSensitive = (): NonSensitivePatient[] =>
patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
id, name, dateOfBirth, gender, occupation
}));

const getById = (id: string): Patient | undefined =>
patients.find(p => p.id === id);

const addPatient = (entry: NewPatient): Patient => {
const newPatient: Patient = { id: uuid(), entries: [], ...entry };
patients.push(newPatient);
return newPatient;
};

const addEntry = (patientId: string, newEntry: NewEntry): Entry | undefined => {
const patient = patients.find(p => p.id === patientId);
if (!patient) return undefined;
const entry: Entry = { id: uuid(), ...newEntry } as Entry;
patient.entries.push(entry);
return entry;
};

export default { getNonSensitive, getById, addPatient, addEntry };