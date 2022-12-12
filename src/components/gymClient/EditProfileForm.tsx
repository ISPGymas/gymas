import React, { ChangeEvent, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { updateDoc, doc } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, VStack, Heading, useBreakpointValue } from '@chakra-ui/react';

import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import PhotoField from '@/components/form/PhotoInput';
import { uploadFile } from '@/utils';
import { ActivityLevelEnum, GenderEnum, GymClient, User } from '@/types';
import SelectField from '../form/SelectField';

const EditClientProfileForm = ({
  user,
  client,
  closeHandler,
}: {
  user: User;
  client: GymClient;
  closeHandler: any;
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const userRef = doc(firebaseDb, 'users', user.id);
  const clientRef = doc(firebaseDb, 'clients', client.id);
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
        age: client.age,
        gender: client.gender,
        weight: client.weight,
        heigth: client.heigth,
        activity: client.activity,
        alergies: client.alergies,
        disabilities: client.disabilities,
      }}
      validationSchema={yup.object({
        firstName: yup.string().trim().optional(),
        lastName: yup.string().trim().optional(),
        email: yup.string().trim().optional(),
        phone: yup.string().trim().optional(),
        age: yup.number().optional(),
        gender: yup.string().oneOf(Object.values(GenderEnum)).optional(),
        weight: yup.number().optional(),
        heigth: yup.number().optional(),
        activity: yup.string().oneOf(Object.values(ActivityLevelEnum)).optional(),
        alergies: yup.string().trim().optional(),
        disabilities: yup.string().trim().optional(),
      })}
      onSubmit={async ({ firstName, lastName, email, phone, ...clientData }) => {
        try {
          setError('');
          setLoading(true);

          await updateDoc(userRef, { firstName, lastName, email, phone });
          await updateDoc(clientRef, clientData as any);
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
            <GridItem colSpan={colSpan}>
              <TextField name="age" label="Age" placeholder="Please enter your age" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={2} textAlign="center">
              <Heading size="md">Choose your gender</Heading>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.gender === GenderEnum.MALE ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('gender', GenderEnum.MALE)}
              >
                Male
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.gender === GenderEnum.FEMALE ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('gender', GenderEnum.FEMALE)}
              >
                Female
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField
                name="weight"
                label="Weight"
                placeholder="Please enter your weight"
                isRequired={true}
                type="number"
              />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField
                name="heigth"
                label="Heigth"
                placeholder="Please enter your heigth"
                isRequired={true}
                type="number"
              />
            </GridItem>
            <GridItem colSpan={2} textAlign="center">
              <Heading size="md" mb={2}>
                Choose your activity level
              </Heading>
              <SelectField name={`activity`} values={Object.values(ActivityLevelEnum)} />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField name="alergies" label="Alergies" placeholder="Please enter alergies" isRequired={false} />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField
                name="disabilities"
                label="Disabilities"
                placeholder="Please enter disabilities"
                isRequired={false}
              />
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

export default EditClientProfileForm;
