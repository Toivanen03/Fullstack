import { UUIDTypes } from "uuid";

export enum Gender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
};

export enum Separator {
    Dash = '-',
    A = 'A'
}

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
};

export interface Patient {
    id: UUIDTypes;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
};

export type NewPatientEntry = Patient;
export type FilteredFields = Omit<Patient, 'ssn'>;