import patientsData from '../../data/patients';
import { Patient, NewPatientEntry, FilteredFields, NewEntry} from '../types';

const patients: Patient[] = patientsData;

const getPatients = (): FilteredFields[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id, name, dateOfBirth, gender, occupation, entries: entries || []
    }));
};

const getPatient = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
}

const addPatient = (entry: NewPatientEntry): Patient => {
    const newPatientEntry = {
        id: entry.id,
        name: entry.name,
        dateOfBirth: entry.dateOfBirth,
        ssn: entry.ssn,
        gender: entry.gender,
        occupation: entry.occupation,
        entries: entry.entries || []
    };
    patients.push(newPatientEntry);
    return newPatientEntry;
};

const addEntry = (id: string, data: string): NewEntry => {
    const newEntry = {
        id: id,
        data: data
    }
    console.log("ID received: ", id)
    console.log("Data", data)
    return newEntry
}

export default {
    getPatient,
    getPatients,
    addPatient,
    addEntry
};