import { State } from './state';
import { Patient, Diagnosis } from '../types';
import _ from 'lodash';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce((memo, patient) => ({ ...memo, [patient.id]: patient }), {}),
          ...state.patients,
        },
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[], diagnoses: Diagnosis[]): Action => {
  const diagnosesDict: { [key: string]: string } = {};
  diagnoses.forEach((d) => (diagnosesDict[d.code] = d.name));

  const payload: Patient[] = _.cloneDeep(patients);
  payload.forEach((p) => {
    p.entries.forEach((entry) => {
      if (entry.diagnosisCodes) {
        entry.diagnosisCodes = entry.diagnosisCodes.map((code) => `${code} ${diagnosesDict[code]}`);
      }
    });
  });

  return {
    type: 'SET_PATIENT_LIST',
    payload: payload,
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: 'ADD_PATIENT',
    payload: payload,
  };
};
