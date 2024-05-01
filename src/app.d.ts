// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { DecodedIdToken } from "firebase-admin/auth";

declare global {

	type Optional<T> = T | undefined | null;

	type UserType = {
		displayName: Optional<string>;
		photoURL: Optional<string>;
		uid: string;
		email: Optional<string>;
	};

	type Todo = {
		id: string;
		text: string;
		complete: boolean;
		createdAt: Date;
	};

	namespace App {
		// interface Error {}
		interface Locals {
			getSession(): Promise<DecodedIdToken | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
