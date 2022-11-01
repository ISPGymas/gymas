import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Field, useField } from 'formik'

const TextField = ({ label, isRequired, ...props }: any) => {
  const [field, meta] = useField(props)
  return (
    <FormControl
      isInvalid={!!(meta.error && meta.touched)}
      isRequired={isRequired}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <Field as={Input} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default TextField
