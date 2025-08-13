import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as patientService from '../services/patients';
import  type { Entry, Gender, NewEntry, Patient } from '../types';
import { Alert, Box, Chip, CircularProgress, Typography } from '@mui/material';
import EntryDetails from '../components/EntryDetails';
import AddEntryForm from '../components/AddEntryForm';
import axios from 'axios';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const p = await patientService.getOne(id);
        setPatient(p);
      } catch (e) {
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const genderIcon = (g: Gender) => g === Gender.Male ? '♂️' : g === Gender.Female ? '♀️' : '⚧️';

  const addEntry = async (entry: NewEntry) => {
    if (!patient || !id) return;
    try {
      const added = await patientService.addEntry(id, entry);
      setPatient({ ...patient, entries: patient.entries.concat(added as Entry) });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.error) {
        setSubmitError(String(e.response.data.error));
      } else {
        setSubmitError('Failed to add entry');
      }
      setTimeout(() => setSubmitError(null), 4000);
      throw e;
    }
  };

  if (loading) return <CircularProgress />;
  if (error || !patient) return <Alert severity="error">{error ?? 'Not found'}</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {patient.name} <Chip label={genderIcon(patient.gender)} />
      </Typography>
      <Typography>Date of birth: {patient.dateOfBirth}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>

      <AddEntryForm onSubmit={addEntry} error={submitError} />

      <Typography variant="h6" sx={{ mt: 2 }}>Entries</Typography>
      {patient.entries.length === 0 && <Typography>No entries</Typography>}
      {patient.entries.map(e => <EntryDetails key={e.id} entry={e} />)}
    </Box>
  );
};

export default PatientPage;