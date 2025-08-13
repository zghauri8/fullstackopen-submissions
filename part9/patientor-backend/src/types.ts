export enum Gender {
Male = 'male',
Female = 'female',
Other = 'other'
}
export interface Diagnosis {
code: string;
name: string;
latin?: string;
}

export interface BaseEntry {
id: string;
date: string;
specialist: string;
description: string;
diagnosisCodes?: Array<Diagnosis['code']>;
type: string; // discriminant
}

export interface HealthCheckEntry extends BaseEntry {
type: 'HealthCheck';
healthCheckRating: 0 | 1 | 2 | 3;
}

export interface HospitalEntry extends BaseEntry {
type: 'Hospital';
discharge: { date: string; criteria: string };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
type: 'OccupationalHealthcare';
employerName: string;
sickLeave?: { startDate: string; endDate: string };
}

export type Entry = HealthCheckEntry | HospitalEntry | OccupationalHealthcareEntry;

export interface Patient {
id: string;
name: string;
ssn: string;
occupation: string;
gender: Gender;
dateOfBirth: string;
entries: Entry[];
}

export type NewPatient = Omit<Patient, 'id' | 'entries'>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
export type NewEntry = Omit<Entry, 'id'>;