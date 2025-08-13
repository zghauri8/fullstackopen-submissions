import type { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckRating } from '../types';
import { useDiagnoses } from '../contexts/DiagnosesContext';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry: ${JSON.stringify(value)}`);
};

const DiagnosisCodes = ({ codes }: { codes?: string[] }) => {
  const diagnoses = useDiagnoses();
  if (!codes || codes.length === 0) return null;
  return (
    <Box sx={{ mt: 1 }}>
      {codes.map(c => (
        <Chip key={c} label={`${c} ${diagnoses[c]?.name ?? ''}`} sx={{ mr: 1, mb: 1 }} />
      ))}
    </Box>
  );
};

const HealthCheck = ({ entry }: { entry: HealthCheckEntry }) => (
  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 2 }}>
    <Typography variant="subtitle1">
      {entry.date} <FavoriteIcon color={
        entry.healthCheckRating === HealthCheckRating.Healthy ? 'success'
          : entry.healthCheckRating === HealthCheckRating.LowRisk ? 'primary'
          : entry.healthCheckRating === HealthCheckRating.HighRisk ? 'warning'
          : 'error'
      } />
    </Typography>
    <Typography>{entry.description}</Typography>
    <DiagnosisCodes codes={entry.diagnosisCodes} />
    <Typography variant="caption">Diagnosed by {entry.specialist}</Typography>
  </Box>
);

const Hospital = ({ entry }: { entry: HospitalEntry }) => (
  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 2 }}>
    <Typography variant="subtitle1">
      {entry.date} <LocalHospitalIcon />
    </Typography>
    <Typography>{entry.description}</Typography>
    <Typography variant="body2">Discharge: {entry.discharge.date} — {entry.discharge.criteria}</Typography>
    <DiagnosisCodes codes={entry.diagnosisCodes} />
    <Typography variant="caption">Diagnosed by {entry.specialist}</Typography>
  </Box>
);

const Occupational = ({ entry }: { entry: OccupationalHealthcareEntry }) => (
  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 2 }}>
    <Typography variant="subtitle1">
      {entry.date} <WorkIcon /> {entry.employerName}
    </Typography>
    <Typography>{entry.description}</Typography>
    {entry.sickLeave && (
      <Typography variant="body2">
        Sick leave: {entry.sickLeave.startDate} — {entry.sickLeave.endDate}
      </Typography>
    )}
    <DiagnosisCodes codes={entry.diagnosisCodes} />
    <Typography variant="caption">Diagnosed by {entry.specialist}</Typography>
  </Box>
);

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheck entry={entry} />;
    case 'Hospital':
      return <Hospital entry={entry} />;
    case 'OccupationalHealthcare':
      return <Occupational entry={entry} />;
    default:
      return assertNever(entry as never);
  }
};

export default EntryDetails;