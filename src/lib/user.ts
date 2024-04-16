import {
    GoogleAuthProvider,
    onIdTokenChanged,
    signInWithPopup,
    signOut,
    type User
} from "firebase/auth";
import { readable, type Subscriber } from "svelte/store";
import { auth } from "./firebase";
import { useSharedStore } from "./use-shared";
import { type ActionResult } from "@sveltejs/kit";
import { applyAction, deserialize } from "$app/forms";

export async function loginWithGoogle() {

    // login with google and get token
    const credential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
    );

    const idToken = await credential.user.getIdToken();

    await addSessionToServer(idToken);
}

export async function addSessionToServer(idToken: string) {

    // send token to server and create cookie
    const body = new FormData();
    body.append('idToken', idToken);

    const action = "/api/auth?/loginWithGoogle";

    const response = await fetch(action, {
        method: 'POST',
        body
    });

    const result: ActionResult = deserialize(
        await response.text()
    );

    switch (result.type) {
        case 'error':
            applyAction(result);
            console.error(result.error);
            logout();
            break;
        case 'redirect':
            console.log('adding session to server...');
            applyAction(result);
    }
}

export async function logout() {

    // sign out on client
    await signOut(auth);

    await removeSessionFromServer();
}

export async function removeSessionFromServer() {

    const action = '/api/auth?/logout';

    // signout on server
    const response = await fetch(action, {
        method: 'POST',
        body: new FormData()
    });

    const result: ActionResult = deserialize(
        await response.text()
    );

    switch (result.type) {
        case 'error':
            applyAction(result);
            console.error(result.error);
            break;
        case 'redirect':
            applyAction(result);
    }
}

const user = (
    defaultUser: UserType | null = null
) => readable<UserType | null>(
    defaultUser,
    (set: Subscriber<UserType | null>) => {
        return onIdTokenChanged(auth, (_user: User | null) => {
            // if no user on server, logout
            if (!defaultUser) {
                logout();
            }
            if (!_user) {
                set(null);
                return;
            }
            const { displayName, photoURL, uid, email } = _user;
            set({ displayName, photoURL, uid, email });
        });
    }
);

export const useUser = (defaultUser: UserType | null = null) =>
    useSharedStore('user', user, defaultUser);