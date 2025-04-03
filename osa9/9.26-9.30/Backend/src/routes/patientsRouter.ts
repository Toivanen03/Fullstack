import express, { Request, Response, NextFunction} from 'express';
import patientsService from '../services/patientsService';
import { Patient, NewPatientEntry, NewEntry } from '../types';
import { patientEntrySchema } from '../utils';
import { v4 as uuid } from 'uuid';

const patientsRouter = express.Router();

interface CustomRequest extends Request {
  body: NewEntry;
}

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  const body = req.body as Patient;
  if (!body.id) {
    body.id = uuid();
  };
  try {
    patientEntrySchema.parse(body);
    next();
  } catch (error: unknown) {
    next(error);
  };
};

patientsRouter.get('/', (_req, res) => {
    res.status(200).send(patientsService.getPatients());
});

patientsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const patient = patientsService.getPatient(id);
  if (patient) {
    res.status(200).send(patient);
  } else {
    res.status(404).json({ error: 'Invalid id!' });
  }
});

patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body);
    res.status(201).json(addedPatient);
});

patientsRouter.post('/:id', (req: CustomRequest, res: Response) => {
  const patientId = req.params.id;
  if (patientId) {
    const data: NewEntry = req.body;
    if (data) {
      try {
        const addedEntry = patientsService.addEntry(patientId, data);
        res.status(201).json(addedEntry);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  }
});

export default patientsRouter;