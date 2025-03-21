import { NewPatientEntry, Gender, Separator } from "./types";

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isSSN = (ssn: string): boolean=> {
    return ssn.length === 11 && Object.values(Separator).some(x => ssn[6] === x);
};

const isValidId = (uuid: string): boolean => {
    return uuid.length === 36 &&
           uuid[8] === '-' &&
           uuid[13] === '-' &&
           uuid[18] === '-' &&
           uuid[23] === '-';
};

const isName = (name: string): boolean => {
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.length >= 2 && parts[0].length >= 2 && parts[1].length >= 2;
};

const isDate = (date: string): boolean => {
    const d = new Date(date);
    return !isNaN(d.getTime());
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseId = (id: string): string => {
    if (!id || !isValidId(id)) {
        throw new Error('Invalid ir missing field "ID":' + id);
    }
    return id;
};

const parseName = (name: string): string => {
    if (!name || !isName(name)) {
        throw new Error('Invalid or missing field "name":' + name);
    };
    return name;
};

const parseDate = (date: string): string => {
    if (!date || !isDate(date)) {
        throw new Error('Invalid or missing field "date":' + date);
    };
    return date;
};

const parseSSN = (ssn: string): string => {
    if (!ssn || !isSSN(ssn)) {
        throw new Error('Invalid or missing field "SSN":' + ssn);
    };
    return ssn;
};

const parseGender = (gender: string): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Invalid or missing field "gender":' + gender);
    }
    return gender;
};

const parseOccupation = (occupation: string): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing field "occupation":' + occupation);
    };
    return occupation;
};

const toNewPatient = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    };

    if ('id' in object && 'name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
        const newPatient: NewPatientEntry = {
            id: parseId(object.id as string),
            name: parseName(object.name as string),
            dateOfBirth: parseDate(object.dateOfBirth as string),
            ssn: parseSSN(object.ssn as string),
            gender: parseGender(object.gender as Gender),
            occupation: parseOccupation(object.occupation as string)
        };

        return newPatient;
    };
    throw new Error('Invalid data: some fields are empty! ');
};

export default toNewPatient;