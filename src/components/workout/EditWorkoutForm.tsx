import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, Heading, useBreakpointValue } from '@chakra-ui/react';

import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import { WorkoutLocation, WorkoutType, WorkoutWithLocation } from '@/types/gym';
import TextAreaField from '../form/TextAreaField';
import LocationSelectField from '../form/LocationSelectField';

const EditWorkoutForm = ({ closeHandler, workout }: { closeHandler: any; workout: WorkoutWithLocation }) => {
  const [locations, setLocations] = useState<WorkoutLocation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const colSpan = useBreakpointValue({ base: 2, md: 1 });
  const workoutRef = doc(firebaseDb, 'workouts', workout.id);

  useEffect(() => {
    const getWorkoutLocations = async () => {
      const workoutLocationCollections = await getDocs(query(collection(firebaseDb, 'workout_locations')));
      const workoutLocationDocs = workoutLocationCollections.docs;
      await Promise.all(
        workoutLocationDocs.map(async (doc) => {
          const workoutLocationData = doc.data() as WorkoutLocation;
          setLocations((currentValues) =>
            currentValues.some((currVal) => currVal.id === doc.id)
              ? currentValues
              : [...currentValues, { ...workoutLocationData, id: doc.id }]
          );
        })
      );
    };

    getWorkoutLocations();
  }, []);

  return (
    <Formik
      initialValues={{
        name: workout.name,
        description: workout.description,
        type: workout.type,
        price: workout.price,
        maxGroupSize: workout.maxGroupSize,
        trainerId: workout.trainerId,
        locationId: workout.locationId,
      }}
      validationSchema={yup.object({
        name: yup.string().required(),
        description: yup.string().optional(),
        type: yup.string().oneOf(Object.values(WorkoutType)).required(),
        price: yup.number().required(),
        maxGroupSize: yup.number().required(),
        trainerId: yup.string().required(),
        locationId: yup.string().optional(),
      })}
      onSubmit={async ({ ...clientData }) => {
        try {
          setError('');
          setLoading(true);

          await updateDoc(workoutRef, clientData as any);
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
              <TextAreaField
                name="description"
                label="Description"
                placeholder="Describe your workout"
                isRequired={true}
                type="string"
              />
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
              <LocationSelectField name={`locationId`} values={locations} label={'Choose workout location'} required />
            </GridItem>
            <GridItem colSpan={colSpan}>
              <TextField name="maxGroupSize" label="Maximum group size" isRequired={true} type="number" />
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
