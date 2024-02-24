<script lang="ts">
	//import { useUser } from '$lib/user';
	import Todos from '@components/todos.svelte';
	import Profile from '@components/profile.svelte';
	import LoginWithGoogle from './login-with-google.svelte';
	import Logout from './logout.svelte';
	import { page } from '$app/stores';

	//const user = useUser();
	$: user = $page.data.user;
</script>

<section class="flex flex-col gap-3 p-5 items-center">
	{#if user}
		<Profile />
		<Logout />
		<Todos />
	{:else}
		<LoginWithGoogle />
	{/if}
</section>
