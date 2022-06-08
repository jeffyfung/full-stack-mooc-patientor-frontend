import { Entry, HealthCheckRating } from '../../types';
import { Typography } from '@material-ui/core';
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const healthCheckRating = (rating: HealthCheckRating) => {
  let color;
  switch (rating) {
    case HealthCheckRating.Healthy:
      color = 'rgba(0, 255, 17, 1)';
      break;
    case HealthCheckRating.LowRisk:
      color = 'rgba(237, 235, 95, 1)';
      break;
    case HealthCheckRating.HighRisk:
      color = 'rgba(252, 4, 0, 1)';
      break;
    case HealthCheckRating.CriticalRisk:
      color = 'rgba(252, 4, 0, 1)';
      break;
  }
  const ratingStyle: React.CSSProperties = { color: color, position: 'relative', top: 6 };
  return <CircleRoundedIcon style={ratingStyle} />;
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: { border: 'black solid 1px', margin: '5px 0px', padding: 5 },
    typeIcon: { position: 'relative', top: 6 },
  };

  switch (entry.type) {
    case 'HealthCheck':
      return (
        <div style={styles.container}>
          <Typography>
            {entry.date} <MedicalServicesRoundedIcon style={styles.typeIcon} />
            <br />
            <span style={{ fontStyle: 'italic' }}>{entry.description}</span>
            <br />
            {entry.healthCheckRating} {healthCheckRating(entry.healthCheckRating)}
            <br />
            diagnose by {entry.specialist}
          </Typography>
          <ul>
            {entry.diagnosisCodes &&
              entry.diagnosisCodes.map((code, idx) => <li key={idx}>{code}</li>)}
          </ul>
        </div>
      );
    case 'OccupationalHealthcare':
      return (
        <div style={styles.container}>
          <Typography>
            {entry.date} <WorkRoundedIcon style={styles.typeIcon} /> {entry.employerName}
            <br />
            <span style={{ fontStyle: 'italic' }}>{entry.description}</span>
            <br />
            diagnose by {entry.specialist}
          </Typography>
          <ul>
            {entry.diagnosisCodes &&
              entry.diagnosisCodes.map((code, idx) => <li key={idx}>{code}</li>)}
          </ul>
        </div>
      );
    case 'Hospital':
      return (
        <div style={styles.container}>
          <Typography>
            {entry.date} <VaccinesRoundedIcon style={styles.typeIcon} />
            {entry.type}
            <br />
            <span style={{ fontStyle: 'italic' }}>{entry.description}</span>
            diagnose by {entry.specialist}
          </Typography>
          <ul>
            {entry.diagnosisCodes &&
              entry.diagnosisCodes.map((code, idx) => <li key={idx}>{code}</li>)}
          </ul>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
