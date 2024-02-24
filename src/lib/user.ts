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

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
        case 'error':
            applyAction(result);
            console.error(result.error);
            break;
        case 'redirect':
            applyAction(result);
    }
}

export async function logout(event: { currentTarget: EventTarget & HTMLFormElement }) {

    // sign out on client
    await signOut(auth);

    // signout on server
    const response = await fetch(event.currentTarget.action, { method: 'POST' });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
        case 'error':
            applyAction(result);
            console.error(result.error);
            break;
        case 'redirect':
            applyAction(result);
    }
}

const user = () => readable<UserType | null>(
    null,
    (set: Subscriber<UserType | null>) =>
        onIdTokenChanged(auth, (_user: User | null) => {
            if (!_user) {
                set(null);
                return;
            }
            const { displayName, photoURL, uid, email } = _user;
            set({ displayName, photoURL, uid, email });
        })
);

export const useUser = () => useSharedStore('user', user);