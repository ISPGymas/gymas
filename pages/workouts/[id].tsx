import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebase';
import { Trainer, User } from '@/types';
import { Workout, WorkoutAddress, WorkoutLocation } from '@/types/gym';
import { Box, Button, Divider, Grid, GridItem, Heading } from '@chakra-ui/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp,
} from 'firebase/firestore';
import moment from 'moment';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

const Workout: NextPage = () => {
  const [alreadyReserved, setAlreadyReserved] = useState<boolean>(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [trainerAccount, setTrainerAccount] = useState<User | null>(null);
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation | null>(null);
  const [workoutAddress, setWorkoutAddress] = useState<WorkoutAddress | null>(null);

  const router = useRouter();
  const { currentUser } = useAuth();
  const { id: workoutId } = router.query;

  const getIsReserveDisabled = useCallback(async () => {
    if (!workoutId || !currentUser) {
      return;
    }
    const reservationsDoc = await getDocs(
      query(
        collection(firebaseDb, 'reservations'),
        where('workoutId', '==', workoutId),
        where('clientId', '==', currentUser?.userInfo?.id)
      )
    );

    setAlreadyReserved((reservationsDoc?.docs || []).length > 0);
  }, [currentUser, workoutId]);

  const fetchWorkoutData = useCallback(async () => {
    const workoutDoc = await getDoc(doc(firebaseDb, 'workouts', workoutId as string));
    const workoutData = workoutDoc?.data() as Workout;
    if (workoutData) {
      const id = workoutId as string;
      setWorkout({ ...workoutData, id });
    }

    const locationDoc = await getDoc(doc(firebaseDb, 'workout_locations', workoutData.locationId as string));
    const locationData = locationDoc.data() as WorkoutLocation;
    if (locationData) {
      setWorkoutLocation({ ...locationData });
    }

    const addressDoc = await getDoc(doc(firebaseDb, 'address', locationData.addressId as string));
    const addressData = addressDoc.data() as WorkoutAddress;
    if (addressData) {
      setWorkoutAddress({ ...addressData });
    }

    const trainerDoc = await getDoc(doc(firebaseDb, 'trainers', workoutData.trainerId as string));
    const trainerData = trainerDoc.data() as Trainer;
    if (trainerData) {
      const userDoc = await getDoc(doc(firebaseDb, 'users', trainerData.userId as string));
      const userData = userDoc.data() as User;
      setTrainer({ ...trainerData, id: workoutData.trainerId });
      if (userData) {
        setTrainerAccount(userData);
      }
    }
    getIsReserveDisabled();
  }, [workoutId, getIsReserveDisabled]);

  useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  const handleTrainingReserve = useCallback(async () => {
    const startDate = Timestamp.now();
    const endDate = Timestamp.fromDate(moment().add(7, 'days').toDate());
    try {
      await addDoc(collection(firebaseDb, 'reservations'), {
        clientId: currentUser?.userInfo?.id,
        end_date: endDate,
        start_date: startDate,
        trainerId: trainer?.id,
        workoutId: workoutId,
      });

      await updateDoc(doc(firebaseDb, 'workouts', workoutId as string), {
        reserved: (workout?.reserved || 0) + 1,
      });

      fetchWorkoutData();
    } catch (err) {
      console.log(err);
    }
  }, [currentUser, trainer?.id, workoutId, workout?.reserved, fetchWorkoutData]);

  const handleCancelReservation = useCallback(async () => {
    if (!workout || !currentUser) {
      return;
    }
    const reservationsDoc = await getDocs(
      query(
        collection(firebaseDb, 'reservations'),
        where('workoutId', '==', workoutId),
        where('clientId', '==', currentUser?.uid)
      )
    );

    const [reservationDoc] = reservationsDoc.docs;
    if (!reservationDoc) {
      return;
    }

    const reservation = reservationDoc.data();
    if (reservation) {
      await deleteDoc(doc(firebaseDb, 'reservations', reservation.id));
    }

    await updateDoc(doc(firebaseDb, 'workouts', workoutId as string), {
      reserved: (workout?.reserved || 0) - 1,
    });
  }, [currentUser, workout, workoutId]);

  return (
    <Box borderRadius="lg" shadow="lg" width="full" justifyContent="center">
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem w="100%">
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
            <Box p="6">
              <Heading size="md" textAlign="center">
                Trainer info:
              </Heading>
              <Divider orientation="horizontal" mb={3} />
              <Box>
                <Heading size="md">Title:</Heading>
                <Heading size="sm">{workout?.name || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Trainer:</Heading>
                <Heading size="sm">{`${trainerAccount?.firstName || ''} ${trainerAccount?.lastName || ''}`}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Trainer contact:</Heading>
                <Heading size="sm">{`${trainerAccount?.email || ''}`}</Heading>
                <Heading size="sm">{`${trainerAccount?.phone || ''}`}</Heading>
              </Box>
            </Box>
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
            <Box p="6">
              <Heading size="md" textAlign="center">
                Training info:
              </Heading>
              <Divider orientation="horizontal" mb={3} />
              <Box>
                <Heading size="md">Max group size:</Heading>
                <Heading size="sm">{`${workout?.maxGroupSize || ''}`}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Reserved:</Heading>
                <Heading
                  size="sm"
                  color={(workout?.reserved || 0) >= (workout?.maxGroupSize || 0) ? 'red' : 'green'}
                >{`${workout?.reserved}`}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Area:</Heading>
                <Heading size="sm">{workoutLocation?.area || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Price:</Heading>
                <Heading size="sm">{`${workout?.price || ''} eur`}</Heading>
              </Box>
            </Box>
            {!alreadyReserved ? (
              <Button
                variant="primary"
                disabled={(workout?.reserved || 0) >= (workout?.maxGroupSize || 0)}
                isFullWidth
                onClick={handleTrainingReserve}
              >
                Reserve
              </Button>
            ) : (
              <Button variant="alarm" isFullWidth onClick={handleCancelReservation}>
                Cancel reservation
              </Button>
            )}
          </Box>
        </GridItem>
        <GridItem w="100%">
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
            <Box p="6">
              <Heading size="md" textAlign="center">
                Address info:
              </Heading>
              <Divider orientation="horizontal" mb={3} />
              <Box>
                <Heading size="md">Building number:</Heading>
                <Heading size="sm">{`${workoutAddress?.buildingNr || ''}`}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">City:</Heading>
                <Heading size="sm">{workoutAddress?.city || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Country:</Heading>
                <Heading size="sm">{workoutAddress?.country || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">District:</Heading>
                <Heading size="sm">{workoutAddress?.disctrict || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Street:</Heading>
                <Heading size="sm">{workoutAddress?.street || ''}</Heading>
              </Box>
              <Box pt={3}>
                <Heading size="md">Zip code:</Heading>
                <Heading size="sm">{workoutAddress?.zipCode || ''}</Heading>
              </Box>
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Workout;
