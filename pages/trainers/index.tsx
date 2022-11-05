import TrainerComponent from '@/components/trainer/Trainer';
import { firebaseDb } from '@/firebase';
import { Trainer } from '@/types';
import { SimpleGrid, Spinner } from '@chakra-ui/react';
import { getDocs } from '@firebase/firestore';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const TrainersList = () => {
  const columns = [1, 1, 2, 2, 3, 3];
  const [isLoading, setIsLoading] = useState(true);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const getTrainers = async () => {
      const trainersCollections = await getDocs(query(collection(firebaseDb, 'trainers')));
      const trainersDocs = trainersCollections.docs;
      await Promise.all(
        trainersDocs.map(async (doc) => {
          const trainerData = doc.data() as Trainer;
          setTrainers((currentValues) =>
            currentValues.some((currVal) => currVal.id === doc.id)
              ? currentValues
              : [...currentValues, { ...trainerData, id: doc.id }]
          );
        })
      );
      setIsLoading(false);
    };

    getTrainers();
  }, []);

  return (
    <div>
      {!isLoading ? (
        <SimpleGrid columns={columns} templateRows={'masonry'}>
          {trainers.map((trainer) => (
            <TrainerComponent key={trainer.id} trainer={trainer}></TrainerComponent>
          ))}
        </SimpleGrid>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default TrainersList;
