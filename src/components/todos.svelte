<script lang="ts">
	import { page } from '$app/stores';
	import { addTodo, genText, useTodos } from '$lib/todos';
	import { useUser } from '$lib/user';
	import TodoItem from '@components/todo-item.svelte';

	let text = $page.data.text;

	const user = useUser();

	const todos = useTodos(user, $page.data.todos);

	function add() {
		addTodo(text);
		text = genText();
	}
</script>

<table class="border-separate border-spacing-x-4">
	<thead>
		<tr>
			<th>Task</th>
			<th>ID</th>
			<th colspan="2">Action</th>
		</tr>
	</thead>
	<tbody>
		{#each $todos || [] as todo}
			<TodoItem {todo} />
		{/each}
	</tbody>
</table>

<form on:submit|preventDefault={add}>
	<input class="border p-2 rounded-lg" bind:value={text} />
	<button class="border p-2 rounded-lg bg-purple-600 text-white font-semibold" type="submit">
		Add Task
	</button>
</form>
