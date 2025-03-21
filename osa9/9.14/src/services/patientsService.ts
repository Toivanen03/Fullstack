import patientsData from '../../data/patients';
import { Patient, NewPatientEntry, FilteredFields} from '../types';

const patients: Patient[] = patientsData;

const getPatients = (): FilteredFields[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
    const newPatientEntry = {
        id: entry.id,
        name: entry.name,
        dateOfBirth: entry.dateOfBirth,
        ssn: entry.ssn,
        gender: entry.gender,
        occupation: entry.occupation
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};

export default {
    getPatients,
    addPatient
};