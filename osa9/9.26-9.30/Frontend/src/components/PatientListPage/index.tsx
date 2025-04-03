import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import axios from 'axios';
import { PatientFormValues, Patient } from "../../types";
import AddPatientModal from "../AddPatientModal/PatientModal";
import patientService from "../../services/patients";
import HealthRatingBar from "../HealthRatingBar";

interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => {const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && Array.isArray(e.response.data)) {
          const errorMsg = e.response.data.join('\n');
          console.error(errorMsg);
          setError(errorMsg);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const fetchPatientData = (id: string) => {
    navigate(`/patients/${id}`);
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6" style={{ fontWeight: "bold", fontSize: "30px", textDecoration: "underline" }}>
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Gender</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Occupation</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              <TableCell onClick={() => fetchPatientData(patient.id)} style={{ cursor: 'pointer', color: 'blue' }}>
                {patient.name}
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
