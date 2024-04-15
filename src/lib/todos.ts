import {
    type QuerySnapshot,
    collection,
    deleteDoc,
    doc,
    loadBundle,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
    type DocumentData,
    Timestamp
} from "firebase/firestore";
import { type Readable, derived } from "svelte/store";
import { auth, db } from "./firebase";

export const genText = () => Math
    .random()
    .toString(36)
    .substring(2, 15);

export const snapToData = (
    q: QuerySnapshot<DocumentData, DocumentData>
) => {

    // creates todo data from snapshot
    if (q.empty) {
        return [];
    }
    return q.docs.map((doc) => {
        const data = doc.data({
            serverTimestamps: 'estimate'
        });
        const created = data.created as Timestamp;
        return {
            ...data,
            created: created.toDate(),
            id: doc.id
        }
    }) as Todo[];
}

export const loadTodos = async (buffer: string) => {

    // load bundle buffer
    const loadedState = await loadBundle(db, buffer);

    if (loadedState.taskState === 'Error') {
        throw 'Error loading data from server';
    }
}

export const useTodos = (
    user: Readable<UserType | null>,
    todos: Todo[]
) => {

    // filtering todos depend on user
    return derived<Readable<UserType | null>, Todo[] | null>(
        user, ($user, set) => {
            if (!$user) {
                set(null);
                return;
            }

            // set default value from server
            set(todos);

            return onSnapshot(
                query(
                    collection(db, 'todos'),
                    where('uid', '==', $user.uid),
                    orderBy('created')
                ), (q) => {

                    // is this a cache version?
                    console.log('Cached: ', q.metadata.fromCache);

                    set(snapToData(q));
                })
        });
};

export const addTodo = async (text: string) => {

    // set todos on client for optimistic updates
    const uid = auth.currentUser?.uid;

    if (!uid) {
        throw 'Must be logged in!';
    }

    setDoc(
        doc(collection(db, 'todos')),
        {
            uid,
            text,
            complete: false,
            created: serverTimestamp()
        });
}

export const updateTodo = (id: string, complete: boolean) => {

    // update on client for optimistic updates
    updateDoc(
        doc(db, 'todos', id),
        { complete }
    );
}

export const deleteTodo = (id: string) => {

    // delete on client for optimistic updates
    deleteDoc(
        doc(db, 'todos', id)
    );
}

