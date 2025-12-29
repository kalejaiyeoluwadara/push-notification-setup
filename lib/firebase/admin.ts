import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let app: App;

export const getFirebaseAdminApp = () => {
  if (!getApps().length) {
    // Check if we have a service account key file path or JSON string
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    try {
      // Parse the service account JSON
      const serviceAccountObj = JSON.parse(serviceAccount);
      
      app = initializeApp({
        credential: cert(serviceAccountObj),
      });
    } catch (error) {
      console.error('Error parsing service account key:', error);
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Must be valid JSON.');
    }
  } else {
    app = getApps()[0];
  }
  return app;
};

export const getFirebaseAdminMessaging = () => {
  const app = getFirebaseAdminApp();
  return getMessaging(app);
};

