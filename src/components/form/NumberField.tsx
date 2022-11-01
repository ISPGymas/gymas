import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { NumberInput, NumberInputField } from '@chakra-ui/react'
import { Field, useField } from 'formik'

const NumberField = ({ label, ...props }: any) => {
  const [field, meta] = useField(props)
  return (
    <FormControl isInvalid={!!(meta.error && meta.touched)}>
      {label && <FormLabel>{label}</FormLabel>}
      <NumberInput min={1} max={1000} defaultValue={100} w='full'>
        <Field as={NumberInputField} {...field} {...props} />
      </NumberInput>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default NumberField
