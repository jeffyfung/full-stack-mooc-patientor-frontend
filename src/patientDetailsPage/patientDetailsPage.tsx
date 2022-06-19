import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry, Patient, OccupationalHealthcareEntry, DistributiveOmit } from '../types';
import { addPatient, useStateValue } from '../state';

import { Button, Typography } from '@material-ui/core';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import EntryDetails from './entryDetail/entryDetails';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import AddEntryModal from '../AddEntryModal';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import _ from 'lodash';

type EntrySubmissionValues = DistributiveOmit<Entry, 'id'>;

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const intercept = (values: EntryFormValues): EntrySubmissionValues => {
    if (
      values.type === 'OccupationalHealthcare' &&
      values.sickLeaveStartDate &&
      values.sickLeaveEndDate
    ) {
      const rtn = _.cloneDeep(values) as Omit<OccupationalHealthcareEntry, 'id'>;
      rtn.sickLeave = {
        startDate: values.sickLeaveStartDate,
        endDate: values.sickLeaveEndDate,
      };
      return rtn;
    } else {
      return values as EntrySubmissionValues;
    }
  };

  const submitNewEntry = (values: EntryFormValues) => {
    console.log('diagnosis codes');
    console.log(values.diagnosisCodes);
    void (async (values: EntryFormValues) => {
      try {
        const url = `${apiBaseUrl}/patients/${id}/entries`;
        const processedValues = intercept(values);
        const { data: updatedPatient } = await axios.post<Patient>(url, processedValues);
        void dispatch(addPatient(updatedPatient));
        closeModal();
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || 'Unrecognized axios error');
          setError(String(e?.response?.data?.error) || 'Unrecognized axios error');
        } else {
          console.error('Unknown error', e);
          setError('Unknown error');
        }
        return;
      }
    })(values);
  };

  if (!id) {
    throw new Error('id is undefined');
  }

  const patient: Patient | undefined = patients[id];

  if (patient && diagnoses) {
    return (
      <div>
        <Typography variant='h4' style={{ marginTop: '0.5em', marginBottom: '0.1em' }}>
          {patient.name}
          {patient.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
        </Typography>
        <Typography>
          ssh: {patient.ssn}
          <br />
          occupation: {patient.occupation}
        </Typography>
        <Typography variant='h5' style={{ marginTop: '0.5em' }}>
          entries
        </Typography>
        {patient.entries.map((entry: Entry, idx: number) => (
          <EntryDetails key={idx} entry={entry} diagnoses={diagnoses} />
        ))}
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button variant='contained' style={{ margin: '5px 0px' }} onClick={() => openModal()}>
          Add New Entry
        </Button>
      </div>
    );
  }

  return <></>;
};

export default PatientDetailsPage;
