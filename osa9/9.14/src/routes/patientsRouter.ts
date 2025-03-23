import express, { Request, Response} from 'express';
import patientsService from '../services/patientsService';
import { Patient } from '../types';
import toNewPatient from '../utils';
import { v4 as uuid } from 'uuid';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
    res.send(patientsService.getPatients());
});

patientsRouter.post('/', (req: Request<unknown, unknown, Patient>, res: Response) => {
    try {
        if (!(req.body.id)) {
            req.body.id = uuid();
        }
        const newPatientEntry = toNewPatient(req.body);
        const addedEntry = patientsService.addPatient(newPatientEntry);
        res.json(addedEntry);
      } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
          errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
      };
    });

export default patientsRouter;