import { UserType } from '@/types';
import { Box, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { WorkoutWithLocation } from '@/types/gym';
import SignUpButton from '../SignUpButton';
import EditWorkoutModal from './EditWorkoutModal';
import { useAuth } from '@/context/AuthContext';
import DeleteWorkoutModal from './DeleteWorkoutModal';

const WorkoutComponent = ({ workout }: { workout: WorkoutWithLocation }) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  return currentUser && workout ? (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden" m={2}>
      <Box p="6" onClick={() => router.replace(`/workouts/${workout.id}`)}>
        <Box mt="1" fontWeight="bold" as="h4" lineHeight="tight" noOfLines={1}>
          {workout.name}
        </Box>
        <Box>{workout.description}</Box>
        <Box>Trainer: {workout.trainerId}</Box>
        <Box>Price: {workout.price.toString()}$</Box>
        <Box>Location: {workout.location.name}</Box>
        <Box>
          <SignUpButton></SignUpButton>
        </Box>
      </Box>
      {currentUser?.userType === UserType.TRAINER && (
        <>
          <Box pt={2}>
            <EditWorkoutModal workout={workout}></EditWorkoutModal>
          </Box>
          <Box pt={2}>
            <DeleteWorkoutModal workoutId={workout.id}></DeleteWorkoutModal>
          </Box>
        </>
      )}
    </Box>
  ) : (
    <Heading>Something went wrong</Heading>
  );
};

export default WorkoutComponent;
