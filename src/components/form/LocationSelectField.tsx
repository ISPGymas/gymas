import { WorkoutLocation } from '@/types/gym';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/react';
import { Field, useField } from 'formik';

const LocationSelectField = ({ label, values, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Field as={Select} {...field} {...props}>
        {(values as WorkoutLocation[]).map(({ id, name }) => {
          return (
            <option key={id} value={id}>
              {name}
            </option>
          );
        })}
      </Field>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default LocationSelectField;
