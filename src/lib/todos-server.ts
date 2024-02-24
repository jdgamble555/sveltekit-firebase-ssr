import { error } from "@sveltejs/kit";
import { adminDB } from "./firebase-admin";
import type { FirebaseError } from "firebase-admin/app";

type QuerySnap = FirebaseFirestore.QuerySnapshot<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
>;

const snapToData = (q: QuerySnap) => {

    // creates todo data from snapshot
    if (q.empty) {
        return [];
    }
    return q.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created: data.created.toMillis()
        }
    }) as Todo[];
}

export const getTodos = async (uid: string) => {

    let todoSnapshot: QuerySnap;

    try {
        todoSnapshot = await adminDB
            .collection('todos')
            .where('uid', '==', uid)
            .orderBy('created')
            .get();

    } catch (e) {
        const fb = e as FirebaseError;
        error(500, fb.message);
    }

    const bundleId = Date.now().toString();

    // create buffer as string to pass to client
    const todoBuffer = adminDB
        .bundle(bundleId)
        .add('todo-query', todoSnapshot)
        .build()
        .toString();

    const todos = snapToData(todoSnapshot);

    return { todos, todoBuffer };
}

