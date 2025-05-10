<script lang="ts">
	import { goto } from "$app/navigation";
	import { Menu, Logs } from "@lucide/svelte";
	import { isLoading } from "$lib/stores/loading";
	import { apiRequest } from "$lib/utils/api";

	import type { User } from "$lib/utils/types";
	import { showSnackbar } from "../snackbar/store";
	import SessionMenu from "./SessionMenu.svelte";

	export let user: User | null;
	export let sidebarOpen: boolean;
	export let onToggleSidebar: () => void;
</script>

<header class="header">
	<div class="flex-container">
		<button on:click={onToggleSidebar} style="background: none; border: none; cursor: pointer;">
			{#if sidebarOpen}
				<Menu size="24" color="red" />
			{:else}
				<Logs size="24" color="red" />
			{/if}
		</button>
		<h1>School Management System</h1>
	</div>

	{#if user?.authenticated}
		<SessionMenu {user} />
	{/if}
</header>

<style>
	.flex-container h1 {
		margin: 0px;
		padding: 0px;
		font-size: 20px;
	}
</style>
