import axios from "axios";
import { Patient, PatientFormValues, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );
  return data;
};

const getById = async (id: string) => {
  return await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (id: string, object: Entry) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients/${id}`, object);
    
  return data;
};

export default {
  getAll, getById, create, addEntry
};

