import express, { Request, Response, NextFunction } from 'express';
import diaryService from '../services/diaryService';
import { /*NonSensitiveDiaryEntry,*/ NewDiaryEntry, DiaryEntry } from "../types";
import { newEntrySchema } from '../utils';
import { errorMiddleware } from '../middleware/errorMiddleware';

const diaryRouter = express.Router();

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    newEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

/*diaryRouter.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
    res.send(diaryService.getNonSensitiveEntries());
});*/

diaryRouter.get('/', (_req, res) => {
    res.send(diaryService.getEntriesWithComments());
});

diaryRouter.post('/', newDiaryParser, (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
  const addedEntry = diaryService.addDiary(req.body);
  res.json(addedEntry);
});

diaryRouter.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

diaryRouter.use(errorMiddleware);

export default diaryRouter;