const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cron = require('node-cron');

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, documentId } = require('firebase/firestore/lite');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(cors());

const firebase = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

const db = getFirestore(firebase);

cron.schedule('0 0 */1 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const reservationsCollections = await getDocs(
      query(collection(db, 'reservations'), where('end_date', '>', tomorrow))
    );
    const reservationsDocs = reservationsCollections.docs;
    const clientIds = reservationsDocs.map((doc) => {
      return doc.data().clientId;
    });

    if (clientIds.length <= 0) {
      return;
    }

    const clientsCollections = await getDocs(query(collection(db, 'clients'), where(documentId(), 'in', clientIds)));
    const clientsDocs = clientsCollections.docs;
    const userIds = clientsDocs.map((doc) => {
      return doc.data().userId;
    });

    if (userIds.length <= 0) {
      return;
    }

    const usersCollections = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', userIds)));
    const usersDocs = usersCollections.docs;
    const phones = usersDocs
      .map((doc) => {
        return doc.data().phone;
      })
      .filter((phone) => !!phone)
      .filter((phone, index, self) => {
        return self.indexOf(phone) === index;
      });

    phones.forEach((phone) => {
      console.log(phone);
      client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
        body: 'Sveiki, norime priminti, kad rytoj jums artėja treniruotė! nepamirškite atsinešti rankšluostį ir gerą nuotaiką!',
      });
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(3001, () => console.log('Express server is running on localhost:3001'));
