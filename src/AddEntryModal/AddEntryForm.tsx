import { EntryType, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from '../types';
import { Field, Formik, Form } from 'formik';
import { Grid, Button } from '@material-ui/core';
import { TextField, DiagnosisSelection, SelectField, SelectOption } from './FormField';
import { useStateValue } from '../state';

interface _Types {
  type: EntryType;
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
}
export type EntryFormValues = Omit<HealthCheckEntry, 'id' | 'type'> &
  Omit<OccupationalHealthcareEntry, 'id' | 'type'> &
  Omit<HospitalEntry, 'id' | 'type'> &
  _Types;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryTypeOptions: SelectOption[] = [
  { label: 'Health Check', value: 'HealthCheck' },
  { label: 'Occupational Healthcare', value: 'OccupationalHealthcare' },
  { label: 'Hospital', value: 'Hospital' },
];

const healthCheckRatingOptions: SelectOption[] = [
  { value: 0 },
  { value: 1 },
  { value: 2 },
  { value: 3 },
];

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  const renderEntryForm = (
    isValid: boolean,
    dirty: boolean,
    setFieldValue: any,
    setFieldTouched: any,
    values: EntryFormValues
  ) => {
    console.log('renderEntryForm');
    console.log(isValid);
    return (
      <div>
        <Form className='form ui'>
          <SelectField label='Type' name='type' options={entryTypeOptions} />
          <Field
            label='Description'
            placeholder='Description'
            name='description'
            component={TextField}
          />
          <Field label='Date' placeholder='YYYY-MM-DD' name='date' component={TextField} />
          <Field
            label='Specialist'
            placeholder='Specialist'
            name='specialist'
            component={TextField}
          />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          {renderAdditionalFields(isValid, dirty, setFieldValue, setFieldTouched, values)}
          <Grid>
            <Grid item>
              <Button
                color='secondary'
                variant='contained'
                style={{ float: 'left' }}
                type='button'
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: 'right',
                }}
                type='submit'
                variant='contained'
                disabled={!dirty || !isValid}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  };

  const renderAdditionalFields = (
    isValid: boolean,
    dirty: boolean,
    setFieldValue: any,
    setFieldTouched: any,
    values: EntryFormValues
  ) => {
    switch (values.type) {
      case 'HealthCheck':
        return renderHealthCheckFields();
      case 'OccupationalHealthcare':
        return renderOccupationalHealthcareFields();
      default:
        throw new Error('Incorrect value for .type');
    }
  };

  const renderHealthCheckFields = () => (
    <>
      <SelectField
        label='Health Check Rating'
        name='healthCheckRating'
        options={healthCheckRatingOptions}
      />
    </>
  );

  const renderOccupationalHealthcareFields = () => (
    <>
      <Field
        label='Employer Name'
        placeholder='Name of employer'
        name='employerName'
        component={TextField}
      />
      <Field
        label='Sick Leave - Start Date'
        placeholder='YYYY-MM-DD'
        name='sickLeaveStartDate'
        component={TextField}
      />
      <Field
        label='Sick Leave - End Date'
        placeholder='YYYY-MM-DD'
        name='sickLeaveEndDate'
        component={TextField}
      />
    </>
  );

  return (
    <Formik
      initialValues={{
        type: 'HealthCheck',
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: 0,
        employerName: '',
        sickLeaveStartDate: '',
        sickLeaveEndDate: '',
        discharge: { date: '', criteria: '' },
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
          errors.date = 'Date format should be YYYY-MM-DD';
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        switch (values.type) {
          case 'OccupationalHealthcare':
            if (!values.employerName) {
              errors.employerName = requiredError;
            }
            if (values.sickLeaveStartDate && values.sickLeaveEndDate) {
              if (!/^\d{4}-\d{2}-\d{2}$/.test(values.sickLeaveStartDate)) {
                errors.sickLeaveStartDate = 'Date format should be YYYY-MM-DD';
              }
              if (!/^\d{4}-\d{2}-\d{2}$/.test(values.sickLeaveEndDate)) {
                errors.sickLeaveEndDate = 'Date format should be YYYY-MM-DD';
              }
            } else if (values.sickLeaveStartDate || values.sickLeaveEndDate) {
              const err = 'Enter both start and end date of sick leave period';
              errors.sickLeaveStartDate = err;
              errors.sickLeaveEndDate = err;
            }
            break;
          default:
            break;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return renderEntryForm(isValid, dirty, setFieldValue, setFieldTouched, values);
      }}
    </Formik>
  );
};

export default AddEntryForm;
