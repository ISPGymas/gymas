import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, Heading, useBreakpointValue } from '@chakra-ui/react';

import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import { ActivityLevelEnum, GenderEnum, User } from '@/types';
import SelectField from '../form/SelectField';
import { MembershipStatus, MembershipType } from '@/types/gym';

const BecomeClientForm = ({ userId, closeHandler }: { userId: string; closeHandler: any }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  return (
    <Formik
      initialValues={{
        age: '',
        gender: GenderEnum.MALE,
        weight: '',
        heigth: '',
        activity: ActivityLevelEnum.LEVEL1,
        membership: MembershipType.BASIC,
        alergies: '',
        disabilities: '',
      }}
      validationSchema={yup.object({
        age: yup.number().required(),
        gender: yup.string().oneOf(Object.values(GenderEnum)).required(),
        weight: yup.number().required(),
        heigth: yup.number().required(),
        activity: yup.string().oneOf(Object.values(ActivityLevelEnum)).required(),
        membership: yup.string().oneOf(Object.values(MembershipType)).required(),
        alergies: yup.string().trim().optional(),
        disabilities: yup.string().trim().optional(),
      })}
      onSubmit={async ({ membership, ...clientData }) => {
        try {
          setError('');
          setLoading(true);

          const client = await addDoc(collection(firebaseDb, 'clients'), {
            ...clientData,
            userId,
          });
          await addDoc(collection(firebaseDb, 'memberships'), {
            clientId: client.id,
            start_date: new Date(),
            end_date: new Date(Date.now() + 999999999),
            status: MembershipStatus.ACTIVE,
            type: membership,
          });
        } catch (error) {
          console.warn(error);
          setError('Failed to create client. Please try again later');
        }

        setLoading(false);
        closeHandler();
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
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
            <GridItem colSpan={2} textAlign="center">
              <Heading size="md">Choose your membership</Heading>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.membership === MembershipType.BASIC ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('membership', MembershipType.BASIC)}
              >
                Basic
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.membership === MembershipType.PREMIUM ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('membership', MembershipType.PREMIUM)}
              >
                Premium
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
              <Button isLoading={loading} variant="primary" width="full" mt={4} type="submit">
                Become client
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

export default BecomeClientForm;
