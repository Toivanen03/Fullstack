import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';
import { apiBaseUrl } from "./constants";
import { Patient } from "./types";
import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientDetails from "./components/PatientData/PatientDetails";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const patients = await patientService.getAll();
        setPatients(patients);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`ERROR: ${error.message}`);
        }
      }
    };

    void fetchPatientList();
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/patients" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/patients" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
          </Routes>
          {error && (
          <Typography 
            variant="h6" 
            color="error" 
            style={{ marginTop: "1em", fontWeight: "bold" }}
          >
            {error}
          </Typography>
        )}
        </Container>
      </Router>
    </div>
  );
};

export default App;
