import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Gender } from '../../types';
import patientService from '../../services/patients';
import diagnoseService from '../../services/diagnoses';
import { Patient, Diagnosis } from '../../types';
import Entries from './EntryDetails';

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
            console.error('Error:', error);
        }
      };
      if (id) {
        fetchPatient(id);
      }
  }, [id]);

  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <MaleIcon className='genderIcon' style={{ color: 'blue' }} />;
      case Gender.Female:
        return <FemaleIcon className='genderIcon' style={{ color: 'pink' }} />;
      case Gender.Other:
        return <TransgenderIcon className='genderIcon' style={{ color: 'purple' }} />;
      default:
        return null;
    }
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className='leftAlign'>
              <Typography variant='h4'>{patient.name} {genderIcon(patient.gender)}</Typography>
            </TableCell>
            <TableCell className='rightAlign'>
              <div className='explanations'>
                <h3><u>Health rating explanation:</u></h3>
                  <div><FavoriteIcon className='healthIcon' style={{ color: "green" }} /><span className='healthText'>Healthy</span></div><br />
                  <div><FavoriteIcon className='healthIcon' style={{ color: "yellow" }} /><span className='healthText'>Low risk</span></div><br />
                  <div><FavoriteIcon className='healthIcon' style={{ color: "red" }} /><span className='healthText'>High risk</span></div><br />
                  <div><FavoriteIcon className='healthIcon' style={{ color: "purple" }} /><span className='healthText'>Critical risk</span></div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

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
          <Entries patient={patient} codeExplanation={codeExplanation} />
        </TableBody>
      </Table>
    </Box>
  );
};

export default PatientDetails;