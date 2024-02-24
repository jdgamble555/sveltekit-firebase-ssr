// Todos

import {
    collection,
    deleteDoc,
    doc,
    getDocsFromCache,
    loadBundle,
    namedQuery,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";

import { type Subscriber, readable } from "svelte/store";
import { auth, db } from "./firebase";

export const getTodosFromCache = async (buffer: string) => {

    const loadedState = await loadBundle(db, buffer);

    if (loadedState.taskState === 'Error') {
        throw 'Error loading data from server';
    }

    const todoQuery = await namedQuery(db, 'todo-query');

    if (!todoQuery) {
        throw 'Error loading data from server';
    }
    const todoSnap = await getDocsFromCache(todoQuery);
    const todos = todoSnap.empty
        ? []
        : todoSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Todo[];

    return todos;
}


export const getTodos = (uid: string, todos: Todo[]) => {

    //const uid = auth.currentUser?.uid;

    if (!uid) {
        throw 'Must be logged in!';
    }

    return readable<Todo[] | null>(
        todos,
        (set: Subscriber<Todo[] | null>) =>
            onSnapshot(
                query(
                    collection(db, 'todos'),
                    where('uid', '==', uid),
                    orderBy('created')
                ), (q) => {
                    console.log(q.metadata.fromCache);
                    set(q.empty
                        ? []
                        : q.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Todo[]
                    );
                })
    );

};


export const addTodo = async (text: string) => {

    const uid = auth.currentUser?.uid;

    if (!uid) {
        throw 'Must be logged in!';
    }

    const todoRef = doc(collection(db, 'todos'));

    setDoc(todoRef, {
        uid,
        text,
        complete: false,
        created: serverTimestamp()
    });

}

export const updateTodo = (id: string, newStatus: boolean) => {
    updateDoc(
        doc(db, 'todos', id),
        { complete: newStatus }
    );
}

export const deleteTodo = (id: string) => {

    const todoRef = doc(db, 'todos', id);

    deleteDoc(todoRef);
}

