<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import { isLoading } from '$lib/stores/loading';
	import { apiRequest } from '$lib/utils/api';
	import type { User } from '$lib/utils/types';
	import { showSnackbar } from '../snackbar/store';
	import { goto } from '$app/navigation';
	import { LogOut, Settings, UserCog } from '@lucide/svelte';
	import { API_BASE_URL } from '$lib/utils/env.config';

	interface Props {
		user: User | null;
	}

	let { user }: Props = $props();
	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	async function onSubmit() {
		try {
			isLoading.set(true);
			const response = await apiRequest<any>(`${API_BASE_URL}/auth/logout`, 'POST', {});
			if (response.success) {
				showSnackbar({ message: response?.message, type: 'success' });
				await goto('/login');
			}
		} catch (err: any) {
			await goto('/login');
		} finally {
			isLoading.set(false);
		}
	}
</script>

<div
	class="user-profile"
	role="button"
	tabindex="0"
	aria-haspopup="true"
	aria-expanded={isOpen}
	onclick={toggleMenu}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleMenu();
		}
	}}
>
	<div class="profile-img">{user?.name?.charAt(0).toUpperCase()}</div>
	<div class="user-info">
		<div class="user-name">{user?.name.toUpperCase()}</div>
		<div class="user-role">
			{user!.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
		</div>
	</div>

	{#if isOpen}
		<div class="dropdown" role="menu" tabindex="0" aria-label="User menu" onmouseleave={closeMenu}>
			<div class="menu-item"><Settings />Settings</div>
			<div class="menu-item"><UserCog />Profile</div>
			<div class="divider"></div>
			<div class="menu-item menu-item-logout">
				<button
					class="logout-button"
					type="button"
					disabled={$isLoading}
					onclick={(event) => {
						event.stopPropagation();
						onSubmit();
					}}
				>
					<div class="logout-container">
						<LogOut color="red" />
						Logout
					</div>
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- prettier-ignore -->
<style>
	.menu-item { padding: 0.65rem 1rem; margin: 2px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
	/* .dropdown { position: absolute; right: 0; margin-top: 10.8rem; margin-right: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 200px; z-index: 10; } */
	.logout-container { display: flex; align-items: center; gap: 8px; color: #ff0000; }
	.logout-button { background: none; border: none; padding: 0; margin: 0; font: inherit; color: currentColor; cursor: pointer; text-decoration: none; }
	.logout-button:disabled { opacity: 0.6; cursor: not-allowed; }


    .user-profile {display: flex; align-items: center; cursor: pointer; padding: 4px 8px; border-radius: var(--radius); transition: var(--transition); margin-left: 10px}
    .user-profile:hover {/* background-color: rgba(67, 97, 238, 0.11); */ background-color: var(--clr-bg-2)}
    .profile-img {width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(135deg, var(--clr-sec), var(--clr-pri)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; margin-right: 12px; box-shadow: 0 3px 8px rgba(67, 97, 238, 0.2)}
    .user-info {display: flex; flex-direction: column}
    .user-name {font-weight: 600}
    .user-role {color: var(--text-light)}
    .dropdown {position: absolute; right: 0; margin-top: 11rem; margin-right: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 200px; z-index: 10}
</style>
