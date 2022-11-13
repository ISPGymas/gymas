import { User } from '@/types';
import { Box, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from '@/firebase';
import { useRouter } from 'next/router';
import { Workout } from '@/types/gym';
import SignUpButton from '../SignUpButton';

const WorkoutComponent = ({ workout }: { workout: Workout }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getWorkout = async () => {
      const data = await getDoc(doc(firebaseDb, 'workouts', workout?.id as string));
      const userData = data?.data() as User;
      if (userData) {
        setUser({ ...userData, id: workout.id });
      }
    };

    getWorkout();
  }, [workout]);
  return user && workout ? (
    <Box
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      m={2}
      onClick={() => router.replace(`/workouts/${workout.id}`)}
    >
      <Box p="6">
        <Box mt="1" fontWeight="bold" as="h4" lineHeight="tight" noOfLines={1}>
        {workout.name}
        </Box>
        <Box>
          {workout.description}
        </Box>
        <Box>
            Trainer: {workout.trainerId}
        </Box>
        <Box>
            Price: {workout.price.toString()}$
        </Box>
        <Box>
            Location: {workout.locationId}
        </Box>
        <Box>
            <SignUpButton></SignUpButton>
        </Box>
      </Box>
    </Box>
  ) : (
    <Heading>Something went wrong</Heading>
  );
};

export default WorkoutComponent;
