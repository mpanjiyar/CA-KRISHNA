import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// In this environment, a custom firestore databaseId is configured in firebase-applet-config.json
const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db: Firestore = dbId && dbId !== '(default)'
  ? getFirestore(app, dbId)
  : getFirestore(app);

// Connection verification test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline/fallback mode active.');
    }
    return false;
  }
}

// Automatically test connection on boot
if (typeof window !== 'undefined') {
  testFirestoreConnection().catch(() => {});
}

export { app };
