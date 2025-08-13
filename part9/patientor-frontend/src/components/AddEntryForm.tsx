import { useState } from 'react';
import type {
  Entry, NewEntry, HealthCheckRating, NewHealthCheckEntry, NewHospitalEntry, NewOccupationalHealthcareEntry, Diagnosis
} from '../types';
import {
  Box, Button, MenuItem, Select, TextField, Typography, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText, Alert
} from '@mui/material';
import { useDiagnoses } from '../contexts/DiagnosesContext';

type Props = {
  onSubmit: (entry: NewEntry) => Promise<void>;
  error: string | null;
};

const diagnosisCodesFromMap = (map: Record<string, Diagnosis>) => Object.values(map).map(d => d.code);

const AddEntryForm = ({ onSubmit, error }: Props) => {
  const diagnoses = useDiagnoses();
  const allCodes = diagnosisCodesFromMap(diagnoses);

  const [type, setType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // health check
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // hospital
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  // occupational
  const [employerName, setEmployerName] = useState('');
  const [sickStart, setSickStart] = useState('');
  const [sickEnd, setSickEnd] = useState('');

  const reset = () => {
    setDate(''); setSpecialist(''); setDescription(''); setDiagnosisCodes([]);
    setHealthCheckRating(HealthCheckRating.Healthy);
    setDischargeDate(''); setDischargeCriteria('');
    setEmployerName(''); setSickStart(''); setSickEnd('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let entry: NewEntry;
    if (type === 'HealthCheck') {
      const payload: NewHealthCheckEntry = {
        type, date, specialist, description, diagnosisCodes,
        healthCheckRating
      };
      entry = payload;
    } else if (type === 'Hospital') {
      const payload: NewHospitalEntry = {
        type, date, specialist, description, diagnosisCodes,
        discharge: { date: dischargeDate, criteria: dischargeCriteria }
      };
      entry = payload;
    } else {
      const payload: NewOccupationalHealthcareEntry = {
        type, date, specialist, description, diagnosisCodes,
        employerName,
        ...(sickStart && sickEnd ? { sickLeave: { startDate: sickStart, endDate: sickEnd } } : {})
      };
      entry = payload;
    }
    await onSubmit(entry);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ border: '1px solid #ddd', p:2, borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Add new entry</Typography>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      <FormControl sx={{ mr: 1, mb: 1, minWidth: 200 }}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select labelId="type-label" label="Type" value={type} onChange={e => setType(e.target.value as any)}>
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Date" type="date" value={date} onChange={e => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }} sx={{ mr: 1, mb: 1 }}
      />
      <TextField
        label="Specialist" value={specialist} onChange={e => setSpecialist(e.target.value)}
        sx={{ mr: 1, mb: 1 }}
      />
      <TextField
        label="Description" value={description} onChange={e => setDescription(e.target.value)}
        fullWidth sx={{ mb: 1 }}
      />

      <FormControl sx={{ mb: 2, minWidth: 300 }}>
        <InputLabel id="diag-label">Diagnosis codes</InputLabel>
        <Select
          multiple labelId="diag-label" input={<OutlinedInput label="Diagnosis codes" />}
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(typeof e.target.value === 'string'
            ? e.target.value.split(',') : e.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {allCodes.map(code => (
            <MenuItem key={code} value={code}>
              <Checkbox checked={diagnosisCodes.indexOf(code) > -1} />
              <ListItemText primary={code} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {type === 'HealthCheck' && (
        <FormControl sx={{ ml: 1, mb: 2, minWidth: 200 }}>
          <InputLabel id="hcr-label">Health check rating</InputLabel>
          <Select
            labelId="hcr-label" label="Health check rating"
            value={healthCheckRating}
            onChange={e => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
          >
            <MenuItem value={0}>0 - Healthy</MenuItem>
            <MenuItem value={1}>1 - LowRisk</MenuItem>
            <MenuItem value={2}>2 - HighRisk</MenuItem>
            <MenuItem value={3}>3 - CriticalRisk</MenuItem>
          </Select>
        </FormControl>
      )}

      {type === 'Hospital' && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Discharge date" type="date" value={dischargeDate} onChange={e => setDischargeDate(e.target.value)}
            InputLabelProps={{ shrink: true }} sx={{ mr: 1, mb: 1 }}
          />
          <TextField
            label="Discharge criteria" value={dischargeCriteria} onChange={e => setDischargeCriteria(e.target.value)}
            sx={{ mb: 1 }}
          />
        </Box>
      )}

      {type === 'OccupationalHealthcare' && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Employer name" value={employerName} onChange={e => setEmployerName(e.target.value)}
            sx={{ mr: 1, mb: 1 }}
          />
          <TextField
            label="Sick leave start" type="date" value={sickStart} onChange={e => setSickStart(e.target.value)}
            InputLabelProps={{ shrink: true }} sx={{ mr: 1, mb: 1 }}
          />
          <TextField
            label="Sick leave end" type="date" value={sickEnd} onChange={e => setSickEnd(e.target.value)}
            InputLabelProps={{ shrink: true }} sx={{ mb: 1 }}
          />
        </Box>
      )}

      <Box>
        <Button type="submit" variant="contained">Add</Button>
      </Box>
    </Box>
  );
};

export default AddEntryForm;