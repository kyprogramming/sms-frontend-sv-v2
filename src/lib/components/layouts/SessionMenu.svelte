<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { apiRequest } from "$lib/utils/api";
	import type { User } from "$lib/utils/types";
	import { showSnackbar } from "../snackbar/store";
	import { goto } from "$app/navigation";
	import { Power, Settings, UserCog } from "@lucide/svelte";

	export let user: User | null;
	let isOpen = false;

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	async function onSubmit() {
		try {
			isLoading.set(true);
			const response = await apiRequest<any>("/api/auth/logout", "POST", {});
			if (response.success) {
				showSnackbar({ message: response.message, type: "success" });
				goto("/");
			}
		} catch (err: any) {
			goto("/login");
		} finally {
			isLoading.set(false);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="user-profile" on:click={toggleMenu}>
	<div class="profile-img">{user?.name?.charAt(0).toUpperCase()}</div>
	<div class="user-info">
		<div class="user-name">{user?.name.toUpperCase()}</div>
		<div class="user-role">
			{user!.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
		</div>
	</div>

	{#if isOpen}
		<div class="dropdown" on:mouseleave={closeMenu}>
			<div class="menu-item"><Settings size="22" />Settings</div>
			<div class="menu-item"><UserCog size="22" />Profile</div>
			<div class="divider"></div>
			<div class="menu-item">
				<div class="logout-container">
					<Power size="22" color="red" />
					<button
						class="logout-button"
						type="button"
						disabled={$isLoading}
						on:click|stopPropagation={onSubmit}
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
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

	.logout-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.logout-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		font: inherit;
		color: currentColor;
		cursor: pointer;
		text-decoration: none;
		font-size: 16px;
	}

	.logout-button:hover {
		color: #ff0000;
		font-weight: 200;
	}

	.logout-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.dropdown {
		position: absolute;
		right: 0;
		margin-top: 13rem;
		margin-right: 1rem;
		background: white;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 200px;
		z-index: 10;
	}

	.menu-item {
		padding: 0.75rem 1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.menu-item:hover {
		background-color: #f3f4f6;
	}

	.divider {
		height: 1px;
		background-color: #e5e7eb;
		margin: 0.5rem 0;
	}
</style>
