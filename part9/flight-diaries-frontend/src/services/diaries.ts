import axios from 'axios'
import type { DiaryEntry } from '../types'
const baseUrl = 'http://localhost:3000/api/diaries' // adjust to backend port

export const getAll = async () => (await axios.get<DiaryEntry[]>(baseUrl)).data

export const create = async (entry: Omit<DiaryEntry, 'id'>) =>
(await axios.post<DiaryEntry>(baseUrl, entry)).data