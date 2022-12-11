import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { deleteDoc, doc } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon } from '@chakra-ui/react';
import { firebaseDb } from '@/firebase';
import { WorkoutType } from '@/types/gym';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

const DeleteWorkoutForm = ({ closeHandler, workoutId }: { closeHandler: any; workoutId: string }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();
  const workoutRef = doc(firebaseDb, 'workouts', workoutId);
  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        price: 0,
        location: '',
        type: WorkoutType.GROUP,
        maxGroupSize: 0,
        trainerId: currentUser?.displayName,
      }}
      validationSchema={yup.object({
        //TODO add validation
      })}
      onSubmit={async () => {
        try {
          setError('');
          setLoading(true);

          await deleteDoc(workoutRef);
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
            <GridItem colSpan={2}>
              <Button
                isLoading={loading}
                variant="primary"
                width="full"
                mt={4}
                type="submit"
                onClick={() => router.replace(`/workouts`)}
              >
                Delete workout
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

export default DeleteWorkoutForm;
