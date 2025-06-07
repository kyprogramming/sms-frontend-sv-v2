<script lang="ts">
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
		LayoutDashboardIcon,
		UserPen,
		UserPlus,
	} from "@lucide/svelte";
	import { MENU_GROUPS } from  "$lib/utils/constants";
	interface Props {
		cls?: string;
	}

	let { cls = "" }: Props = $props();

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
		LayoutDashboardIcon,
		UserPen,
		UserPlus,
	};

	let activeGroup: string | null = $state(null);
	let activeMenuItem: string | null = $state(null);
	let sidebarCollapsed = false;
	// All menu groups and their items

	function toggleGroup(groupTitle: string) {
		activeGroup = activeGroup === groupTitle ? null : groupTitle;
	}
</script>

<nav class={`sidebar ${cls}`}>
	<div class="sidebar-menu">
		{#each MENU_GROUPS as group}
			<div class="menu-group">
				{#if group.link}
					<!-- Top-level single link -->
					{@const SvelteComponent = iconComponents[group.icon]}
					<a
						href={group.link}
						class="group-header {activeMenuItem === group.title ? 'active' : ''}"
						onclick={() => {
							activeMenuItem = group.title;
							activeGroup = null;
						}}
						data-sveltekit-preload-data="off"
					>
						<SvelteComponent size={18} class="lucide-icon" />
						{#if !sidebarCollapsed}
							<div class="header-content">
								<span>{group.title}</span>
							</div>
						{/if}
					</a>
				{:else}
					<!-- Group with submenu -->
					{@const SvelteComponent_1 = iconComponents[group.icon]}
					<div
						class="group-header {activeGroup === group.title ? 'active' : ''}"
						role="button"
						tabindex="0"
						onclick={() => toggleGroup(group.title)}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								toggleGroup(group.title);
							}
						}}
					>
						<SvelteComponent_1 size={18} class="lucide-icon" />
						{#if !sidebarCollapsed}
							{@const SvelteComponent_2 = activeGroup === group.title ? ChevronDown : ChevronRight}
							<div class="header-content">
								<span>{group.title}</span>
								<SvelteComponent_2 size={16} class="pull-right" />
							</div>
						{/if}
					</div>
					{#if activeGroup === group.title && !sidebarCollapsed && group.items}
						<div class="group-items" transition:slide>
							{#each group.items as item}
								<a
									class="menu-item {activeMenuItem === item.title ? 'active' : ''}"
									href={item.link}
									aria-current={activeMenuItem === item.title ? "page" : undefined}
									onclick={() => {
										activeMenuItem = item.title;
									}}
                                    data-sveltekit-preload-data="tap" 
								>
									<span>{item.title}</span>
								</a>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</div>
</nav>

<style>
	.group-items {
		border-radius: 8px;
	}

	.menu-item {
		display: flex;
		padding: 8px 15px 8px 6px;
		cursor: pointer;
		align-items: center;
		gap: 0.5rem;
		border-left: 2px solid var(--clr-bg-3);
		color: #5a6a85;
		text-decoration: none;
		transition: all 0.2s;
		transition:
			border-left 0.2s ease,
			color 0.2s ease;
		margin-left: 35px;
	}

	.menu-item:hover {
		border-left: 2px solid var(--clr-pri-light);
	}

	.menu-item.active {
		border-left: 2px solid var(--clr-pri-light);
	}

	.menu-item.active span {
		color: #2364f1;
		text-decoration: underline;
	}

	.menu-item span {
		margin-left: 0.5rem;
	}

	.menu-item span:hover {
		color: var(--clr-pri);
		text-decoration: dotted;
	}
</style>
