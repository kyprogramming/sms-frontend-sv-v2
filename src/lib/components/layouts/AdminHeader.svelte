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
		<SessionMenu user={user}/>
	{/if}
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60px;
		padding: 15px;

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
