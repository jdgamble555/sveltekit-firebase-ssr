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

export async function loginWithGoogle(event: Event) {

    const form = event.target as HTMLFormElement;

    // login with google and get token
    const credential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
    );

    const idToken = await credential.user.getIdToken();

    // send token to server and create cookie
    const body = new FormData(form);
    body.append('idToken', idToken);

    const response = await fetch(form.action, {
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
            break;
        case 'redirect':
            applyAction(result);
    }
}

export async function logout(event: Event) {

    const form = event.target as HTMLFormElement;

    // sign out on client
    await signOut(auth);

    // signout on server
    const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
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
) => {
    // handle cases where session is expired
    if (!defaultUser) {
        signOut(auth);
    }
    return readable<UserType | null>(
        defaultUser,
        (set: Subscriber<UserType | null>) => {
            return onIdTokenChanged(auth, (_user: User | null) => {
                // if no user on server, logout

                if (!_user) {
                    set(null);
                    return;
                }
                const { displayName, photoURL, uid, email } = _user;
                set({ displayName, photoURL, uid, email });
            });
        }
    );
};
export const useUser = (defaultUser: UserType | null = null) =>
    useSharedStore('user', user, defaultUser);