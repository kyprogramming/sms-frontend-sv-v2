<script lang="ts">
	import { Menu, ListCollapseIcon, Search, AlignJustify } from "@lucide/svelte";
	import type { User } from "$lib/utils/types";
	import SessionMenu from "./SessionMenu.svelte";
	import { fade } from "svelte/transition";
	interface Props {
		user: User | null;
		sidebarOpen: boolean;
		onToggleSidebar: () => void;
	}

	let { user, sidebarOpen, onToggleSidebar }: Props = $props();
</script>

<header class="header">
	<div class="flex-container">
		<button class="rounded-btn-icon" onclick={onToggleSidebar}>
			{#if sidebarOpen}
				<Menu />
			{:else}
				<ListCollapseIcon  />
			{/if}
		</button>
		<h1>School Management System</h1>
	</div>

	{#if user?.authenticated}
		<SessionMenu {user} />
	{/if}
</header>

<style>
	.flex-container h1 {margin: 0px;padding: 0px;font-size: 20px;gap: 2rem;}
</style>
