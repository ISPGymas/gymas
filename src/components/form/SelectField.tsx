import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Select } from '@chakra-ui/react'
import { Field, useField } from 'formik'

const SelectField = ({ label, values, ...props }: any) => {
  const [field, meta] = useField(props)
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)}>
      {label && <FormLabel>{label}</FormLabel>}
      <Field as={Select} {...field} {...props}>
        {values.map((value: string, index: number) => {
          return (
            <option key={index} value={value}>
              {value}
            </option>
          )
        })}
      </Field>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default SelectField
