const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const auth = admin.auth();
const db = admin.firestore(); // Jika mau pakai Firestore

module.exports = { admin, auth, db };
