
import { adminDB } from '$lib/firebase-admin';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession } }) => {

    const session = await getSession();

    if (!session) {
        return {
            user: null,
            todosBundle: null
        }
    }

    const {
        name: displayName,
        email,
        picture: photoURL,
        uid
    } = session;

    const user: UserType = {
        displayName,
        email,
        photoURL,
        uid
    };

    const taskSnapshot = await adminDB
        .collection('todos')
        .where('uid', '==', session.uid)
        .orderBy('created')
        .get();

    const bundleId = Date.now().toString();

    const bundleBuffer = adminDB
        .bundle(bundleId)
        .add('todo-query', taskSnapshot)
        .build();

    return {
        user,
        todosBundle: bundleBuffer.toString()
    };

}) satisfies PageServerLoad;