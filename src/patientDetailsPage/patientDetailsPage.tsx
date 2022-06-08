import { useParams } from 'react-router-dom';
import { Entry, Patient } from '../types';
import { useStateValue } from '../state';

import { Typography } from '@material-ui/core';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import EntryDetails from './entryDetail/entryDetails';

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }] = useStateValue();

  if (!id) {
    throw new Error('id is undefined');
  }

  const patient: Patient | undefined = patients[id];

  if (patient) {
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
          <EntryDetails key={idx} entry={entry} />
        ))}
      </div>
    );
  }

  return <></>;
};

export default PatientDetailsPage;
