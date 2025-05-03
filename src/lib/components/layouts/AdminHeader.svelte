<script lang="ts">
	import { goto } from "$app/navigation";
	import { Menu, Logs } from "@lucide/svelte";
	import { isLoading } from "$lib/stores/loading";
	import { apiRequest } from "$lib/utils/api";

	import type { User } from "$lib/utils/types";

	export let user: User | null;
	export let sidebarOpen: boolean;
	export let onToggleSidebar: () => void;

	async function onSubmit(event: Event) {
		event.preventDefault();
		try {
			// Call api
			isLoading.set(true);
			const response = await apiRequest<any>("/api/auth/logout", "POST", {});
			if (response.success) {
				goto("/");
			}
		} catch (err: any) {
			goto("/login");
		} finally {
			isLoading.set(false);
		}
	}
</script>

<header class="header">
	<div class="logo">
		<button
			on:click={onToggleSidebar}
			style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; margin-right: 20px;"
		>
			{#if sidebarOpen}
				<Menu size="24" color="red" />
			{:else}
				<Logs size="24" color="red" />
			{/if}
		</button>
		<h1>School<span>Management System</span></h1>
	</div>

	{#if user?.authenticated}
		<div class="user-profile">
			<div class="profile-img">{user.name?.charAt(0).toUpperCase()}</div>
			<div class="user-info">
				<div class="user-name">{user.name.toUpperCase()}</div>
				<div class="user-role">
					{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
				</div>
			</div>
			<div>
				<form on:submit={onSubmit}>
					<button class="logout-button" type="submit" disabled={$isLoading}>
						Logout
					</button>
				</form>
			</div>
		</div>
	{/if}
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
		padding: 15px;
		box-shadow: var(--shadow-sm);
	}

	.user-profile {
		display: flex;
		align-items: center;
		cursor: pointer;
		padding: 6px 10px;
		border-radius: var(--radius);
		transition: var(--transition);
		margin-left: 10px;
	}

	.user-profile:hover {
		background-color: rgba(67, 97, 238, 0.11);
	}

	.profile-img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--secondary), var(--primary));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
		margin-right: 12px;
		box-shadow: 0 3px 8px rgba(67, 97, 238, 0.2);
		font-size: 16px;
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.user-name {
		font-weight: 600;
		font-size: 14px;
	}

	.user-role {
		font-size: 12px;
		color: var(--text-light);
	}

	.logout-button {
		background-color: #d60f0f; /* red-500 */
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
		margin-left: 15px;
	}

	.logout-button:hover {
		background-color: #dc2626; /* red-600 */
	}

	.logout-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5); /* red-500/50 */
	}

	.logo {
		display: flex;
		padding: 24px 20px;
		text-align: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		margin-bottom: 10px;
	}

	.logo h1 {
		font-size: 26px;
		font-weight: 700;
		color: var(--primary-light);
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 0.5px;
	}

	.logo span {
		color: var(--primary-light);
		background: linear-gradient(45deg, var(--primary-light), var(--success));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-left: 4px;
	}
</style>
