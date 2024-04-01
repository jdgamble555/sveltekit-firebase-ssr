import { COOKIE_NAME } from "$lib/firebase-admin";
import { getFirebaseSession } from "$lib/firebase-session";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {

    // setup firebase session to be accessible everywhere
    event.locals.getSession = async () => {

        const sessionCookie = event.cookies.get(COOKIE_NAME);

        if (!sessionCookie) {
            return null;
        }

        const {
            error,
            decodedClaims
        } = await getFirebaseSession(sessionCookie);

        if (error) {
            console.error(error);
            return null;
        }

        return decodedClaims;
    };

    return resolve(event);
};