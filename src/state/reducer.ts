import { State } from './state';
import { Patient, Diagnosis } from '../types';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_DIAGNOSES';
      payload: { [key: string]: Diagnosis };
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
    case 'SET_DIAGNOSES':
      return {
        ...state,
        diagnoses: action.payload,
      };
    default:
      return state;
  }
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
  const payload: { [key: string]: Diagnosis } = {};
  diagnoses.forEach((d) => (payload[d.code] = d));
  return {
    type: 'SET_DIAGNOSES',
    payload: payload,
  };
};

export const setPatientList = (payload: Patient[]): Action => {
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
