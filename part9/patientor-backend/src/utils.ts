import { z } from 'zod';
import { Gender, NewPatient, NewEntry } from './types';
// Patient schema
const NewPatientSchema = z.object({
name: z.string().min(1),
dateOfBirth: z.string().min(1),
ssn: z.string().min(1),
gender: z.nativeEnum(Gender),
occupation: z.string().min(1)
});

export const toNewPatient = (obj: unknown): NewPatient => {
return NewPatientSchema.parse(obj);
};

// Entry base
const BaseEntrySchema = z.object({
date: z.string().min(1),
specialist: z.string().min(1),
description: z.string().min(1),
diagnosisCodes: z.array(z.string()).optional(),
type: z.string()
});

// Specific entries
const HealthCheckSchema = BaseEntrySchema.extend({
type: z.literal('HealthCheck'),
healthCheckRating: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
});

const HospitalSchema = BaseEntrySchema.extend({
type: z.literal('Hospital'),
discharge: z.object({
date: z.string().min(1),
criteria: z.string().min(1)
})
});

const OccupationalSchema = BaseEntrySchema.extend({
type: z.literal('OccupationalHealthcare'),
employerName: z.string().min(1),
sickLeave: z.object({ startDate: z.string(), endDate: z.string() }).optional()
});

const NewEntrySchema = z.discriminatedUnion('type', [
HealthCheckSchema, HospitalSchema, OccupationalSchema
]);

export const toNewEntry = (obj: unknown): NewEntry => {
return NewEntrySchema.parse(obj);
};