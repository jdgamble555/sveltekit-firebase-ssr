import { PUBLIC_FIREBASE_CONFIG } from '$env/static/public';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebase_config = JSON.parse(PUBLIC_FIREBASE_CONFIG);

// initialize firebase only once
if (!getApps().length) {
    initializeApp(firebase_config);
}

export const auth = getAuth();
export const db = getFirestore();

