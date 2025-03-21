import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatient from '../utils';
import { v4 as uuid } from 'uuid';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
    res.send(patientsService.getPatients());
});

patientsRouter.post('/', (req, res) => {
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