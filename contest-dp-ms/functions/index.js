const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, FieldPath } = require('firebase-admin/firestore');
const functions = require("firebase-functions");

initializeApp();

const db = getFirestore();

exports.contestData = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  
  let docInformation = await db
  .collection('rawDataMostRecent')
  .doc('contests')
  .collection('g1')
  .doc('last_result')
  .get()

  response.send(docInformation.data());
});
