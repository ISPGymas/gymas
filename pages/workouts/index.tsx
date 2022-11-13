import CreateWorkoutModal from '@/components/workout/CreateWorkoutModal';
import WorkoutComponent from '@/components/workout/Workout';
import { useAuth } from '@/context/AuthContext';
import { firebaseDb } from '@/firebase';
import { Workout } from '@/types/gym';
import { SimpleGrid, Spinner } from '@chakra-ui/react';
import { getDocs } from '@firebase/firestore';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const WorkoutsList = () => {
  const { currentUser } = useAuth();
  const columns = [1, 1, 2, 2, 3, 3];
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const getWorkouts = async () => {
      const workoutCollections = await getDocs(query(collection(firebaseDb, 'workouts')));
      const workoutDocs = workoutCollections.docs;
      await Promise.all(
        workoutDocs.map(async (doc) => {
          const workoutData = doc.data() as Workout;
          setWorkouts((currentValues) =>
            currentValues.some((currVal) => currVal.id === doc.id)
              ? currentValues
              : [...currentValues, { ...workoutData, id: doc.id }]
          );
        })
      );
      setIsLoading(false);
    };

    getWorkouts();
  }, []);

  return (
    <div>
      {!isLoading ? (
        <SimpleGrid columns={columns} templateRows={'masonry'}>
          {trainers.map((workout) => (
            <WorkoutComponent key={workout.id} workout={workout}></WorkoutComponent>
          ))}
          <CreateWorkoutModal userId={currentUser?.uid || ''}></CreateWorkoutModal>
        </SimpleGrid>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WorkoutsList;
