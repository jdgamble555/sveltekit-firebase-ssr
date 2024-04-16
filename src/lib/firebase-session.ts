import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "./firebase-admin";

// https://firebase.google.com/docs/auth/admin/manage-cookies#create_session_cookie


export const createFirebaseSession = async (idToken: string) => {

    let decodedIdToken: DecodedIdToken;

    try {
        decodedIdToken = await adminAuth.verifyIdToken(idToken);
    } catch {
        const error = {
            status: 401,
            message: 'Unauthorized request!'
        };
        return { error }
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {

        const options = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            path: '/'
        };

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn
        });

        return { sessionCookie, options };
    }

    const error = {
        status: 401,
        message: 'Recent sign in required!'
    };
    return { error }
};

export const getFirebaseSession = async (sessionCookie: string) => {

    let decodedClaims: DecodedIdToken;
    try {
        decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    } catch {
        const error = {
            status: 401,
            message: 'Unauthorized request!'
        };
        return { error }
    }

    return { decodedClaims };
}