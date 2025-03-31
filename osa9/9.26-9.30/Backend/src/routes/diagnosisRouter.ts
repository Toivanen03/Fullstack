import express from 'express';
import diagnosisService from '../services/diagnosisService';

const diagnosisRouter = express.Router();

diagnosisRouter.get('/', (_req, res) => {
    res.send(diagnosisService.getDiagnoses());
});

export default diagnosisRouter;