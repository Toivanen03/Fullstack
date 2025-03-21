import patients from '../../data/patients';
import { FilteredFields} from '../types';

const getPatients = (): FilteredFields[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};

export default {
    getPatients
};