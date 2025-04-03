import patientsData from '../../data/patients';
import { Patient, NewPatientEntry, FilteredFields, NewEntry, Entry } from '../types';
import { v4 as uuid } from 'uuid';
import { entrySchema } from '../utils';

const patients: Patient[] = patientsData;

const getPatients = (): FilteredFields[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id, name, dateOfBirth, gender, occupation, entries: entries || []
    }));
};

const getPatient = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
};

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

const addEntry = (id: string, entry: NewEntry): Entry => {
    const patient = patients.find(p => p.id === id);
    if (!patient) {
        throw new Error('Patient not found!');
    }
    const parsedEntry = entrySchema.parse({ ...entry, id: uuid(), date: new Date().toISOString().split('T')[0] });
    patient.entries = patient.entries || [];
    patient.entries.push(parsedEntry);

    return parsedEntry;
};

export default {
    getPatient,
    getPatients,
    addPatient,
    addEntry
};