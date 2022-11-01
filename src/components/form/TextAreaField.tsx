import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Textarea } from '@chakra-ui/react'
import { Field, useField } from 'formik'

const TextAreaField = ({ label, isRequired, ...props }: any) => {
  const [field, meta] = useField(props)
  return (
    <FormControl
      isInvalid={!!(meta.error && meta.touched)}
      isRequired={isRequired}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <Field as={Textarea} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default TextAreaField
