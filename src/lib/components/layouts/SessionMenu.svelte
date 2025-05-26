<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';

	import { isLoading } from "$lib/stores/loading";
	import { apiRequest } from "$lib/utils/api";
	import type { User } from "$lib/utils/types";
	import { showSnackbar } from "../snackbar/store";
	import { goto, invalidateAll } from "$app/navigation";
	import { Power, Settings, UserCog } from "@lucide/svelte";
	import { API_BASE_URL } from '$lib/constants/env.config';

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
			const response = await apiRequest<any>(`${API_BASE_URL}/auth/logout`, "POST", {});
                // console.log("logout response:",response)
			if (response.success) {
				showSnackbar({ message: response?.message, type: "success" });
                await invalidateAll(); 
                await goto('/login'); 
			}
		} catch (err: any) {
			await goto("/login");
		} finally {
            // await invalidateAll(); 
			isLoading.set(false);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="user-profile" onclick={toggleMenu}>
	<div class="profile-img">{user?.name?.charAt(0).toUpperCase()}</div>
	<div class="user-info">
		<div class="user-name">{user?.name.toUpperCase()}</div>
		<div class="user-role">
			{user!.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
		</div>
	</div>

	{#if isOpen}
		<div class="dropdown" onmouseleave={closeMenu}>
			<div class="menu-item"><Settings size="22" />Settings</div>
			<div class="menu-item"><UserCog size="22" />Profile</div>
			<div class="divider"></div>
			<div class="menu-item">
				<button class="logout-button" type="button" disabled={$isLoading} onclick={stopPropagation(onSubmit)}>
					<div class="logout-container">
						<Power size="22" color="red" />
						Log out
					</div>
				</button>
			</div>
		</div>
	{/if}
</div>
