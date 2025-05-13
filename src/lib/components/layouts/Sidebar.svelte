<script lang="ts">
	export let cls = "";
	import { slide } from "svelte/transition";

	import {
		Home,
		LayoutDashboard,
		Users,
		IndianRupee,
		MonitorPlay,
		GitBranch,
		Video,
		AlertCircle,
		ArrowDownCircle,
		CreditCard,
		ClipboardList,
		ClipboardCheck,
		CalendarCheck,
		QrCode,
		MonitorCheck,
		GraduationCap,
		Calendar,
		ListChecks,
		Megaphone,
		Download,
		BookOpen,
		Library,
		Package,
		FileText,
		Bus,
		FileBadge,
		LayoutPanelLeft,
		UserSquare,
		LineChart,
		Settings,
		ChevronDown,
		ChevronRight,
		ChevronRightSquare as ChevronRightDouble,
	} from "@lucide/svelte";
	import { MENU_GROUPS } from "$lib/constants";

	const iconComponents: any = {
		LayoutDashboard,
		Home,
		Users,
		IndianRupee,
		MonitorPlay,
		GitBranch,
		Video,
		AlertCircle,
		ArrowDownCircle,
		CreditCard,
		ClipboardList,
		ClipboardCheck,
		CalendarCheck,
		QrCode,
		MonitorCheck,
		GraduationCap,
		Calendar,
		ListChecks,
		Megaphone,
		Download,
		BookOpen,
		Library,
		Package,
		FileText,
		Bus,
		FileBadge,
		LayoutPanelLeft,
		UserSquare,
		LineChart,
		Settings,
	};

	let activeGroup: string | null = null;
	let activeMenuItem: string | null = null;
	let sidebarCollapsed = false;
	// All menu groups and their items

	function toggleGroup(groupTitle: string) {
		activeGroup = activeGroup === groupTitle ? null : groupTitle;
	}
</script>

<nav class={`sidebar ${cls}`}>
	<!-- <span class="current-session">Current Session: 2025-26</span> -->
	<div class="sidebar-menu">
		{#each MENU_GROUPS as group}
			<div class="menu-group">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="group-header {activeGroup === group.title ? 'active' : ''}" on:click={() => toggleGroup(group.title)}>
					<svelte:component this={iconComponents[group.icon]} size={18} class="lucide-icon" />
					{#if !sidebarCollapsed}
						<div class="header-content">
							<span>{group.title}</span>
							<svelte:component this={activeGroup === group.title ? ChevronDown : ChevronRight} size={16} class="pull-right" />
						</div>
					{/if}
				</div>
				{#if activeGroup === group.title && !sidebarCollapsed}
					<div class="group-items" transition:slide>
						{#each group.items as item}
							<a href={item.link} class="menu-item {activeMenuItem === item.title ? 'active' : ''}" on:click={() => (activeMenuItem = item.title)} data-sveltekit-preload-data="off">
								<span>{item.title}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</nav>
