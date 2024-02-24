
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

    const todoSnapshot = await adminDB
        .collection('todos')
        .where('uid', '==', session.uid)
        .orderBy('created')
        .get();

    const bundleId = Date.now().toString();

    const bundleBuffer = adminDB
        .bundle(bundleId)
        .add('todo-query', todoSnapshot)
        .build();

    const todos = todoSnapshot.empty
        ? []
        : todoSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                created: data.created.toMillis()
            }
        }) as Todo[];

    return {
        user,
        todos,
        todoBundle: bundleBuffer.toString()
    };

}) satisfies PageServerLoad;