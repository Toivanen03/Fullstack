import { NewDiaryEntry, Weather, Visibility } from './types';
import { z } from 'zod';

export const newEntrySchema = z.object({
    weather: z.nativeEnum(Weather),
    visibility: z.nativeEnum(Visibility),
    date: z.string().date(),
    comment: z.string().optional()
});

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
    return newEntrySchema.parse(object);
};