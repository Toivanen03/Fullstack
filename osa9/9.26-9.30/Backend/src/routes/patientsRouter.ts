import express, { Request, Response, NextFunction} from 'express';
import patientsService from '../services/patientsService';
import { Patient, NewPatientEntry, NewEntry } from '../types';
import { newPatientEntrySchema } from '../utils';
import { v4 as uuid } from 'uuid';

const patientsRouter = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  const body = req.body as Patient;
  if (!body.id) {
    body.id = uuid();
  };
  try {
    newPatientEntrySchema.parse(body);
    next();
  } catch (error: unknown) {
    next(error);
  };
};

const newEntryParser = () => {
console.log("Täällä")
}

patientsRouter.get('/', (_req, res) => {
    res.status(200).send(patientsService.getPatients());
});

patientsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const patient = patientsService.getPatient(id);
  if (patient) {
    res.status(200).send(patient);
  } else {
      throw new Error('Invalid id!')
    }
});

patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.status(200).json(addedPatient);
});

patientsRouter.post('/:id', newEntryParser, (req, res: Response<NewEntry>) => {
  const patientId = req.params.id;
  if (patientId) {
    const data = (req.body);
    if (data) {
      const addedEntry = patientsService.addEntry(patientId, data)
      res.status(200).send(addedEntry);
    } else {
      throw new Error('Missing entries!');
    }
  } else {
    throw new Error('Invalid ID!')
  }
});

export default patientsRouter;