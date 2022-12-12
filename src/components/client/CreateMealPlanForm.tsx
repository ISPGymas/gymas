import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { Button, SimpleGrid, GridItem, Alert, AlertIcon, Heading, useBreakpointValue, Box } from '@chakra-ui/react';
import TextField from '@/components/form/TextField';
import { firebaseDb } from '@/firebase';
import LocationSelectField from '../form/LocationSelectField';
import { Goal, MealPlan } from '@/types/gym';
import TextAreaField from '../form/TextAreaField';
import { useAuth } from '@/context/AuthContext';
import { GymClient } from '@/types';
import { User } from 'firebase/auth';

const CreateMealPlanForm = ({ closeHandler, client }: { closeHandler: any, client: GymClient}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const colSpan = useBreakpointValue({ base: 3, md: 1 });
  const { currentUser } = useAuth();

const axios = require("axios");


const options = {
  method: 'GET',
  url: 'https://body-mass-index-bmi-calculator.p.rapidapi.com/metric',
  params: {weight: client.weight, height: client.heigth/100},
  headers: {
    'X-RapidAPI-Key': '4482d544cfmsh69bc4efcd2d4ca3p1b8062jsn774f379c5b27',
    'X-RapidAPI-Host': 'body-mass-index-bmi-calculator.p.rapidapi.com'
  }
};

axios.request(options).then(function (response: { data: any; }) {
	console.log(response.data);
}).catch(function (error: any) {
	console.error(error);
});

  return (
    <Formik
      initialValues={{
        trainerId: currentUser?.userInfo?.id,
        clientId: client.id,
        goal: Goal.WEIGHTLOSS,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fibre: 0,
        sugarRatio: 0,
        alergies: '',
      }}
      validationSchema={yup.object({
        goal: yup.string().oneOf(Object.values(Goal)).required(),
        calories: yup.number().required(),
        protein: yup.number().required(),
        carbs: yup.number().required(),
        fat: yup.number().required(),
        fibre: yup.number().required(),
        sugarRatio: yup.number().required(),
        alergies: yup.string().optional(),
      })}
      onSubmit={async (MealPlanData) => {
        try {
          setError('');
          setLoading(true);
          console.log(MealPlanData);
          await addDoc(collection(firebaseDb, 'meal_plans'), MealPlanData);
        } catch (error) {
          console.warn(error);
          setError('Failed to create meal plan. Please try again later');
        }

        setLoading(false);
        closeHandler();
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <SimpleGrid columns={3} columnGap={3} rowGap={5} w="full">
            <GridItem colSpan={3} textAlign="center">
              <Heading size="md">Choose Meal Plan type</Heading>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.goal === Goal.WEIGHTLOSS ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('goal',  Goal.WEIGHTLOSS)}
              >
                Weightloss
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.goal === Goal.MUSCLE ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('goal',  Goal.MUSCLE)}
              >
                Muscle
              </Button>
            </GridItem>
            <GridItem colSpan={colSpan}>
              <Button
                variant={formik.values.goal === Goal.MAINTAIN ? 'primary' : 'secondary'}
                width="full"
                mt={4}
                onClick={() => formik.setFieldValue('goal',  Goal.MAINTAIN)}
              >
                Maintainance
              </Button>
            </GridItem>
            <GridItem colSpan={3}>
              <Box>
                Clients BMI: {(client.weight/((client.heigth/100)^2)).toFixed(0)}
              </Box>
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="calories" label="Calories" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="protein" label="Protein(%)" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="carbs" label="Carbs(%)" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="fat" label="Fat(%)" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="fibre" label="Fibre" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="sugarRatio" label="Carbs from sugar" isRequired={true} type="number" />
            </GridItem>
            <GridItem colSpan={3}>
              <TextField name="allergies" label="Allergies" isRequired={false} type="string" />
            </GridItem>
            <GridItem colSpan={3}>
              <Button isLoading={loading} variant="primary" width="full" mt={4} type="submit">
                Create Meal Plan
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

export default CreateMealPlanForm;
