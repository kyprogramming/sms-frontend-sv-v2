<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { apiRequest } from "$lib/utils/api";
	import type { User } from "$lib/utils/types";
	import { showSnackbar } from "../snackbar/store";
	import { goto, invalidateAll } from "$app/navigation";
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
				showSnackbar({ message: response?.message, type: "success" });
                await invalidateAll(); 
                goto('/login'); 
				// goto("/");
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
				<button class="logout-button" type="button" disabled={$isLoading} on:click|stopPropagation={onSubmit}>
					<div class="logout-container">
						<Power size="22" color="red" />
						Log out
					</div>
				</button>
			</div>
		</div>
	{/if}
</div>
