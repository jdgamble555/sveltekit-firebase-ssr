
import { genText } from '$lib/todos';
import { getTodos } from '$lib/todos-server';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession } }) => {

    const session = await getSession();

    // always generate random things on server
    const text = genText();

    if (!session) {
        return {
            text,
            user: null,
            todoBuffer: null
        }
    }

    const user: UserType = {
        displayName: session.name,
        email: session.email,
        photoURL: session.picture,
        uid: session.uid
    };

    // get todos from firebase admin
    const { todos, todoBuffer } = await getTodos(session.uid);

    return {
        text,
        user,
        todos,
        todoBuffer
    };

}) satisfies PageServerLoad;