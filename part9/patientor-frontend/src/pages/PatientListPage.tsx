import { useEffect, useState } from 'react'
import type { NonSensitivePatient } from '../types'
import { Gender } from '../types'
import * as patientService from '../services/patients';
import { Link as RouterLink } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

const PatientListPage = () => {
  const [patients, setPatients] = useState<NonSensitivePatient[]>([]);

  useEffect(() => {
    patientService.getAll().then(setPatients);
  }, []);

  const genderIcon = (g: Gender) => g === Gender.Male ? '♂️' : g === Gender.Female ? '♀️' : '⚧️';

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Patients</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{genderIcon(p.gender)}</TableCell>
                <TableCell>{p.occupation}</TableCell>
                <TableCell>
                  <RouterLink to={`/patients/${p.id}`}>open</RouterLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientListPage;