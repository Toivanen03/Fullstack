import { TableCell, TableRow } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { Patient, Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from '../../types';
import './entriesStyle.css';

interface EntriesProps {
    patient: Patient;
    codeExplanation: { [key: string]: string };
}

const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) => (
    <div>
      <li><b>Discharge Date: </b>{entry.discharge.date}</li>
      <li><b>Discharge Criteria: </b>{entry.discharge.criteria}</li>
    </div>
  );
  
  const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => (
    <>
      <li><b>Employer: </b>{entry.employerName}</li>
      {entry.sickLeave && (
        <li><b>Sick Leave: </b> {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</li>
      )}
    </>
  );
  
  
  const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => (
    <div>
      <li><b>Health: </b><div className='detailsIcon'>{healthIcon(entry.healthCheckRating)}</div></li>
    </div>
  );

  const healthIcon = (health: HealthCheckRating) => {
    switch (health) {
      case HealthCheckRating.Healthy:
        return <FavoriteIcon className='healthIcon' style={{ color: "green" }} />;
      case HealthCheckRating.LowRisk:
        return <FavoriteIcon className='healthIcon' style={{ color: "yellow" }} />;
      case HealthCheckRating.HighRisk:
        return <FavoriteIcon className='healthIcon' style={{ color: "red" }} />;
        case HealthCheckRating.CriticalRisk:
          return <FavoriteIcon className='healthIcon' style={{ color: "purple" }} />;
      default:
        return null;
    }
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return <HospitalEntryDetails entry={entry as HospitalEntry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcareEntryDetails entry={entry as OccupationalHealthcareEntry} />;
      case 'HealthCheck':
        return <HealthCheckEntryDetails entry={entry as HealthCheckEntry} />;
      default: throw new Error('Invalid entry type! ');
    }
  };

  const typeIcon = (entry: Entry) => {
    switch (entry.type) {
      case 'Hospital':
        return <LocalHospitalIcon className='healthIcon' />;
      case 'OccupationalHealthcare':
        return <MedicalInformationIcon className='healthIcon' />;
      case 'HealthCheck':
        return <MedicalServicesIcon className='healthIcon' />;
      default: return null;
    }
  };
  
const Entries = ({ patient, codeExplanation }: EntriesProps) => {
  return (
    <>
      {patient.entries && patient.entries.length > 0 && (
        <TableRow>
          <TableCell className='entriesHeader'><strong>Entries:</strong></TableCell>
          <TableCell>
            {patient.entries.map((entryObj, index) => (
              <ul key={index} className='entriesCell'>
              <div key={index}>
                <li><b>Date: </b> {entryObj.date} <div className='detailsIcon'>{typeIcon(entryObj)}</div></li>
                <li><b>Description: </b> <i>{entryObj.description}</i></li>
                <ul>
                  {entryObj.diagnosisCodes?.map((code, index) => (
                    <li key={index}>{code} - {codeExplanation[code]}</li>
                  ))}
                </ul>
                <EntryDetails entry={entryObj} />
                <li><b>Diagnose by </b>{entryObj.specialist}</li>
              </div>
              </ul>
            ))}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default Entries;