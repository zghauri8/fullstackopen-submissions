import { useEffect, useState } from 'react'
import type { DiaryEntry, Weather, Visibility } from './types'
import * as diaryService from './services/diaries'
import axios from 'axios'
const App = () => {
const [entries, setEntries] = useState<DiaryEntry[]>([])
const [date, setDate] = useState('')
const [weather, setWeather] = useState<Weather>('sunny')
const [visibility, setVisibility] = useState<Visibility>('great')
const [comment, setComment] = useState('')
const [error, setError] = useState<string | null>(null)

useEffect(() => {
diaryService.getAll().then(setEntries)
}, [])

const addEntry = async (e: React.FormEvent) => {
e.preventDefault()
try {
const newEntry = await diaryService.create({ date, weather, visibility, comment })
setEntries(prev => prev.concat(newEntry))
setDate(''); setComment('')
} catch (err) {
if (axios.isAxiosError(err) && err.response?.data) {
setError(String(err.response.data))
} else setError('unknown error')
setTimeout(() => setError(null), 4000)
}
}

return (
<div>
<h2>Flight diaries</h2>
{error && <div style={{ color: 'red' }}>{error}</div>}
  <h3>Add new</h3>
  <form onSubmit={addEntry}>
    <div>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>

    <div>Visibility:
      {(['great','good','ok','poor'] as Visibility[]).map(v =>
        <label key={v}><input type="radio" name="visibility" checked={visibility===v} onChange={() => setVisibility(v)} />{v}</label>
      )}
    </div>

    <div>Weather:
      {(['sunny','rainy','cloudy','stormy','windy'] as Weather[]).map(w =>
        <label key={w}><input type="radio" name="weather" checked={weather===w} onChange={() => setWeather(w)} />{w}</label>
      )}
    </div>

    <div>Comment: <input value={comment} onChange={e => setComment(e.target.value)} /></div>
    <button type="submit">add</button>
  </form>

  <h3>Entries</h3>
  {entries.map(e =>
    <div key={e.id}>
      <strong>{e.date}</strong> — {e.visibility}, {e.weather}<br />
      {e.comment && <em>{e.comment}</em>}
    </div>
  )}
</div>

)
}
export default App