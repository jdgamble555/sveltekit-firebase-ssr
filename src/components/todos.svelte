<script lang="ts">
	import { page } from '$app/stores';
	import { addTodo, getTodos } from '$lib/todos';
	import TodoItem from '@components/todo-item.svelte';

	const genText = () => Math.random().toString(36).substring(2, 15);

	let text = genText();	

	const uid = $page.data.user.uid;

	const cacheTodos = $page.data.todos;

	const todos = getTodos(uid, cacheTodos);

	function add() {
		addTodo(text);
		text = genText();
	}
</script>

{#if $todos?.length}
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
{/if}
<form on:submit|preventDefault={add}>
	<input class="border p-2 rounded-lg" bind:value={text} />
	<button class="border p-2 rounded-lg bg-purple-600 text-white font-semibold" type="submit">
		Add Task
	</button>
</form>
