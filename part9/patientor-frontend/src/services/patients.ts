import axios from 'axios'
import type { NonSensitivePatient, Patient, NewPatient, NewEntry, Entry } from '../types'

const baseUrl = 'http://localhost:3001/api/patients'

export const getAll = async (): Promise<NonSensitivePatient[]> => {
const { data } = await axios.get<NonSensitivePatient[]>(baseUrl)
return data
}

export const getOne = async (id: string): Promise<Patient> => {
const url = baseUrl + '/' + id
const { data } = await axios.get<Patient>(url)
return data
}

export const create = async (patient: NewPatient): Promise<Patient> => {
const { data } = await axios.post<Patient>(baseUrl, patient)
return data
}

export const addEntry = async (id: string, entry: NewEntry): Promise<Entry> => {
const url = baseUrl + '/' + id + '/entries'
const { data } = await axios.post<Entry>(url, entry)
return data
}