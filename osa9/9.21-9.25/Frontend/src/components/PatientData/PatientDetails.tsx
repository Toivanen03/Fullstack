import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Gender } from "../../types";
import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";
import { Patient, Diagnosis } from "../../types";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [codeExplanation, setCodeExplanation] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchPatient = async (id: string) => {
        try {
            const patient = await patientService.getById(id);
            setPatient(patient.data);
            const diagnoses = await diagnoseService.getAll();
            const diagnosesMap: { [key: string]: string } = {};
            patient.data.entries?.forEach((entry) => {
              if (entry.diagnosisCodes) {
                entry.diagnosisCodes.forEach((code) => {
                  const diagnosis = diagnoses.find((diagnosis: Diagnosis) => diagnosis.code === code);
                  if (diagnosis) {
                    diagnosesMap[code] = diagnosis.name;
                  }
                });
              }
            });
    
            setCodeExplanation(diagnosesMap)
        } catch (error) {
            console.error("Error:", error);
        }
      };
      if (id) {
        fetchPatient(id);
      }
  }, [id]);

  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon style={{ color: "blue" }} />;
      case Gender.Female:
        return <FemaleIcon style={{ color: "pink" }} />;
      case Gender.Other:
        return <TransgenderIcon style={{ color: "purple" }} />;
      default:
        return null;
    }
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" flexDirection={"column"} alignItems="center" gap={2} mb={3}>
        <Typography variant="h4">{patient.name} {genderIcon(patient.gender)}</Typography>
      </Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><strong>Date of Birth:</strong></TableCell>
            <TableCell>{patient.dateOfBirth}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>Social Security Number:</strong></TableCell>
            <TableCell>{patient.ssn}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><strong>Occupation:</strong></TableCell>
            <TableCell>{patient.occupation}</TableCell>
          </TableRow>
          {patient.entries && patient.entries.length > 0 && (
          <TableRow>
            <TableCell style={{ verticalAlign: 'top' }}><strong>Entries:</strong></TableCell>
            <TableCell>
              {patient.entries.map((entryObj, index) => (
                <div key={index}>
                  <b>Date: </b> {entryObj.date}<br />
                  <b>Description: </b> {entryObj.description}<br />
                  <ul>
                    {entryObj.diagnosisCodes?.map((code, index) => (
                      <li key={index}>{code} - {codeExplanation[code]}</li>
                    ))}
                </ul>
                </div>
              ))}
            </TableCell>
          </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PatientDetails;