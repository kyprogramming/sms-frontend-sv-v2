<script lang="ts">
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';

  let email = '';
  let password = '';

  async function handleLogin() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data));
      authStore.set(data);
      goto(`/dashboard/${data.role}`);
    } else {
      alert(data.message);
    }
  }
</script>

<form on:submit|preventDefault={handleLogin} class="space-y-4 p-4 max-w-md mx-auto">
  <input bind:value={email} type="email" placeholder="Email" required class="w-full p-2 border rounded" />
  <input bind:value={password} type="password" placeholder="Password" required class="w-full p-2 border rounded" />
  <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Login</button>
</form>
