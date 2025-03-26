import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllDiaries = async () => {
  const response = await axios
    .get<DiaryEntry[]>(baseUrl);
  return response.data;
}

export const createDiaryEntry = async (object: NewDiaryEntry, setError: React.Dispatch<React.SetStateAction<string>>) => {
  try {
    const response = await axios
      .post<DiaryEntry>(baseUrl, object);
    return response.data;
  } catch (error) {
    let errorString = '';
    if (axios.isAxiosError(error)) {
      error.response?.data.error.forEach((err: { message: string }) => {
        errorString += `• ${err.message}\n`;
      });
    };
    setError(errorString);
  };
};