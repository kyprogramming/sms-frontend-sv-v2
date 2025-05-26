<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { goto, invalidateAll } from "$app/navigation";

	let name = $state("");
	let email = $state("");
	let password = $state("");

	async function handleRegister() {
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});

		const data = await res.json();
		if (res.ok) {
            await invalidateAll(); 
			await goto("/login");
		} else {
			alert(data.message);
		}
	}
</script>

<form onsubmit={preventDefault(handleRegister)} class="space-y-4 p-4 max-w-md mx-auto">
	<input bind:value={name} type="text" placeholder="Full Name" required class="w-full p-2 border rounded" />
	<input bind:value={email} type="email" placeholder="Email" required class="w-full p-2 border rounded" />
	<input bind:value={password} type="password" placeholder="Password" required class="w-full p-2 border rounded" />
	<button type="submit" class="w-full bg-green-600 text-white py-2 rounded">Register</button>
</form>
