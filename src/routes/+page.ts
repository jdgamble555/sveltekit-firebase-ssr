import { browser } from '$app/environment';
import { getTodosFromCache } from '$lib/todos';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {

    if (data.todoBundle) {

        // add admin query to client cache
        const todos = browser
            ? await getTodosFromCache(data.todoBundle)
            : data.todos;

        return {
            ...data,
            todos
        };
    }

    return {
        user: null,
        todosBundle: null
    };

}) satisfies PageLoad;