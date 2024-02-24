
import { getTodosFromCache } from '$lib/todos';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {

    if (data.todosBundle) {

        const todos = await getTodosFromCache(data.todosBundle);

        return {
            ...data,
            todos
        };

    }

    return {
        user: null,
        todosBundle: null
    };


    /*
            const tasks = taskSnapshot.empty
            ? []
            : taskSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    created: data.created.toMillis()
                }
            }) as Todo[];
            */


}) satisfies PageLoad;