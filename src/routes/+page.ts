import { browser } from '$app/environment';
import { loadTodos } from '$lib/todos';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {

    if (browser && data.todoBuffer) {

        // add admin query to client cache
        await loadTodos(data.todoBuffer);
    }

    return data;

}) satisfies PageLoad;