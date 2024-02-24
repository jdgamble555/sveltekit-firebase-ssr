<script lang="ts">
	import { loginWithGoogle } from '$lib/user';
</script>

<form method="POST" action="/api/auth?/loginWithGoogle" on:submit|preventDefault={loginWithGoogle}>
	<button type="submit" class="bg-red-600 text-white font-semibold p-2">
		Signin with Google
	</button>
</form>
