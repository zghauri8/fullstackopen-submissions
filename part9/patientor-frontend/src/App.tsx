import { Routes, Route, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import NavBar from './components/NavBar';
import { DiagnosesProvider } from './contexts/DiagnosesContext';
import PatientListPage from './pages/PatientListPage';
import PatientPage from './pages/PatientPage';

const App = () => {
  return (
    <DiagnosesProvider>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<PatientListPage />} />
          <Route path="/patients/:id" element={<PatientPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </DiagnosesProvider>
  );
};

export default App;