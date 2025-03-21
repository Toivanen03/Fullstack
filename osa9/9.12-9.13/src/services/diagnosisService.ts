import diagnose from '../../data/diagnoses';
import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnose;

const getDiagnoses = (): Diagnosis[] => {
    return diagnoses;
};

export default {
    getDiagnoses
};