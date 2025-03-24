import express, { Request, Response, NextFunction} from 'express';
import patientsService from '../services/patientsService';
import { Patient, NewPatientEntry } from '../types';
import { newEntrySchema } from '../utils';
import { v4 as uuid } from 'uuid';

const patientsRouter = express.Router();

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  const body = req.body as Patient;
  if (!body.id) {
    body.id = uuid();
  };
  try {
    newEntrySchema.parse(body);
    next();
  } catch (error: unknown) {
    next(error);
  };
};

patientsRouter.get('/', (_req, res) => {
    res.send(patientsService.getPatients());
});

patientsRouter.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedEntry = patientsService.addPatient(req.body);
    res.json(addedEntry);
});

export default patientsRouter;