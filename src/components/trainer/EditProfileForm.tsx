import React, { ChangeEvent, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { updateDoc, doc } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, VStack, Heading, useBreakpointValue } from '@chakra-ui/react';

import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import PhotoField from '@/components/form/PhotoInput';
import { uploadFile } from '@/utils';
import { ActivityLevelEnum, EducationLevelEnum, GenderEnum, Trainer, User } from '@/types';
import SelectField from '../form/SelectField';

const EditTrainerProfileForm = ({
  user,
  trainer,
  closeHandler,
}: {
  user: User;
  trainer: Trainer;
  closeHandler: any;
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const userRef = doc(firebaseDb, 'users', user.id);
  const trainerRef = doc(firebaseDb, 'trainers', trainer.id);
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const onAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile({
        path: `avatars/${user.id}`,
        file: e.target.files[0],
      });
      updateDoc(userRef, {
        avatar: `avatars/${user.id}`,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        experience: trainer.experience,
        education: trainer.education,
      }}
      validationSchema={yup.object({
        firstName: yup.string().trim().optional(),
        lastName: yup.string().trim().optional(),
        email: yup.string().trim().optional(),
        phone: yup.string().trim().optional(),
        experience: yup.number().optional(),
        gender: yup.string().oneOf(Object.values(EducationLevelEnum)).optional(),
      })}
      onSubmit={async ({ firstName, lastName, email, phone, ...trainerData }) => {
        try {
          setError('');
          setLoading(true);

          await updateDoc(userRef, { firstName, lastName, email, phone });
          await updateDoc(trainerRef, trainerData as any);
        } catch (error) {
          console.warn(error);
          setError('Failed to update user info. Please try again later');
        }

        setLoading(false);
        closeHandler();
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
            <GridItem colSpan={colSpan}>
              <TextField name="firstName" label="First Name" placeholder="Please enter first name" isRequired={true} />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField name="lastName" label="Last Name" placeholder="Please enter last name" isRequired={true} />
            </GridItem>
            <GridItem colSpan={2}>
              <TextField name="email" label="Email" placeholder="Please enter email" isRequired={true} type="email" />
            </GridItem>
            <GridItem colSpan={2}>
              <TextField name="phone" label="Phone" placeholder="Please enter phone" isRequired={true} />
            </GridItem>
            <GridItem colSpan={2}>
              <TextField
                name="experience"
                label="Experience in years"
                placeholder="Please enter your experience"
                isRequired={true}
                type="number"
              />
            </GridItem>
            <GridItem colSpan={2} textAlign="center">
              <Heading size="md" mb={2}>
                Choose your education level
              </Heading>
              <SelectField name={`education`} values={Object.values(EducationLevelEnum)} />
            </GridItem>
            <GridItem colSpan={2}>
              <VStack>
                <Heading size={'md'}>Upload photo</Heading>
                <PhotoField name={'photo'} onChange={onAvatarUpload} />
              </VStack>
            </GridItem>
            <GridItem colSpan={2}>
              <Button isLoading={loading} variant="primary" width="full" mt={4} type="submit">
                Update
              </Button>
            </GridItem>
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </SimpleGrid>
        </form>
      )}
    </Formik>
  );
};

export default EditTrainerProfileForm;
