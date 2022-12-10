import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, Heading, useBreakpointValue } from '@chakra-ui/react';

import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import { ActivityLevelEnum, GenderEnum, User } from '@/types';
import SelectField from '../form/SelectField';
import { MembershipStatus, MembershipType, Workout, WorkoutLocation, WorkoutType } from '@/types/gym';
import TextAreaField from '../form/TextAreaField';
import { useAuth } from '@/context/AuthContext';

const EditWorkoutForm = ({closeHandler, workout }: {closeHandler: any, workout: Workout }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const colSpan = useBreakpointValue({ base: 2, md: 1 });
  const { currentUser } = useAuth();
  const workoutRef = doc(firebaseDb, 'workouts', workout.id)
  return (
    <Formik
      initialValues={{
        name: workout.name,
        description: workout.description,
        price: workout.price,
        location: "Pramonės gym-",
        type: WorkoutType.GROUP,
        maxGroupSize: workout.groupSize,
        trainerId: workout.trainerId,
      }}
      validationSchema={yup.object({
        //TODO add validation
      })}
      onSubmit={async ({...clientData }) => {
        try {
          setError('');
          setLoading(true);

          await updateDoc(workoutRef, clientData);
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
              <TextField name="name" label="Name" placeholder="Enter workout name" isRequired={true} type="string" />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField name="price" label="Price" placeholder="Enter workout price" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={2}>
              <TextAreaField name="description" label="Description" placeholder="Describe your workout" isRequired={true} type="string" />
            </GridItem>
            <GridItem colSpan={2} textAlign="center">
              <Heading size="md">Choose workout type</Heading>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.type === WorkoutType.GROUP ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('type', WorkoutType.GROUP)}
              >
                Group
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.type === WorkoutType.SOLO ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('type', WorkoutType.SOLO)}
              >
                Solo
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField
                name="location"
                label="Location"
                placeholder="Enter workout location"
                isRequired={true}
                type="string"
              />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField
                name="maxGroupSize"
                label="Maximum group size"
                isRequired={true}
                type="number"
              />
            </GridItem>
            <GridItem colSpan={2}>
              <Button isLoading={loading} variant="primary" width="full" mt={4} type="submit">
                Edit workout
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

export default EditWorkoutForm;
