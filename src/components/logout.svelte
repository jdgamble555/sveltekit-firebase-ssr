<script lang="ts">
	import { logout } from '$lib/user';
</script>

<form method="POST" action="/auth?/logout" on:submit|preventDefault={logout}>
	<button type="submit" class="border bg-blue-600 text-white w-fit p-3 rounded-lg font-semibold">
		Logout
	</button>
</form>
