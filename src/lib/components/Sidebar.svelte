<script lang="ts">
	export let cls = "";
	import { slide } from "svelte/transition";

	import {
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
		ChevronDown,
		ChevronRight,
		ChevronRightSquare as ChevronRightDouble,
	} from "@lucide/svelte";

	const iconComponents: any = {
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
	let sidebarCollapsed = false;
	// All menu groups and their items
	const menuGroups = [
		{
			title: "Front Office",
			icon: "Home",
			items: [
				{ title: "Admission Enquiry", link: "/admin/enquiry" },
				{ title: "Visitor Book", link: "/admin/visitors" },
				{ title: "Phone Call Log", link: "/admin/generalcall" },
				{ title: "Postal Dispatch", link: "/admin/dispatch" },
				{ title: "Postal Receive", link: "/admin/receive" },
				{ title: "Complain", link: "/admin/complaint" },
				{ title: "Setup Front Office", link: "/admin/visitorspurpose" },
			],
		},
		{
			title: "Student Information",
			icon: "Users",
			items: [
				{ title: "Student Details", link: "/student/search" },
				{ title: "Student Admission", link: "/student/create" },
				{ title: "Online Admission", link: "/admin/onlinestudent" },
				{ title: "Disabled Students", link: "/student/disablestudentslist" },
				{ title: "Multi Class Student", link: "/student/multiclass" },
				{ title: "Bulk Delete", link: "/student/bulkdelete" },
				{ title: "Student Categories", link: "/category" },
				{ title: "Student House", link: "/admin/schoolhouse" },
				{ title: "Disable Reason", link: "/admin/disable_reason" },
			],
		},
		{
			title: "Fees Collection",
			icon: "IndianRupee",
			items: [
				{ title: "Collect Fees", link: "/studentfee" },
				{ title: "Offline Bank Payments", link: "/admin/offlinepayment" },
				{ title: "Search Fees Payment", link: "/studentfee/searchpayment" },
				{ title: "Search Due Fees", link: "/studentfee/feesearch" },
				{ title: "Fees Master", link: "/admin/feemaster" },
				{ title: "Quick Fees", link: "/admin/customfeesmaster/index" },
				{ title: "Fees Group", link: "/admin/feegroup" },
				{ title: "Fees Type", link: "/admin/feetype" },
				{ title: "Fees Discount", link: "/admin/feediscount" },
				{ title: "Fees Carry Forward", link: "/admin/feesforward" },
				{ title: "Fees Reminder", link: "/admin/feereminder/setting" },
			],
		},
	];

	function toggleGroup(groupTitle: string) {
		activeGroup = activeGroup === groupTitle ? null : groupTitle;
	}
</script>

<nav class={`sidebar ${cls}`}>
	<!-- <span class="current-session">Current Session: 2025-26</span> -->

	<div class="sidebar-menu">
		{#each menuGroups as group}
			<div class="menu-group">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="group-header {activeGroup === group.title ? 'active' : ''}"
					on:click={() => toggleGroup(group.title)}
				>
					<svelte:component
						this={iconComponents[group.icon]}
						size={18}
						class="lucide-icon"
					/>
					{#if !sidebarCollapsed}
						<div class="header-content">
							<span>{group.title}</span>
							<svelte:component
								this={activeGroup === group.title ? ChevronDown : ChevronRight}
								size={16}
								class="pull-right"
							/>
						</div>
					{/if}
				</div>
				{#if activeGroup === group.title && !sidebarCollapsed}
					<div class="group-items" transition:slide>
						{#each group.items as item}
							<a href={item.link} class="menu-item">
								<svelte:component
									this={ChevronRightDouble}
									size={14}
									class="menu-icon"
								/>
								<span>{item.title}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</nav>

<style>
	.sidebar {
		width: 300px;
		max-width: 300px;
		min-height: 90vh;
		background: #fff;
		color: var(--gray5);
		transition: max-width 0.3s ease;
		overflow-y: auto;
		border-right: 1px solid #e2e8f0;
		font-family: Roboto, sans-serif;
		font-size: 14px;
	}

	.sidebar.collapsed {
		max-width: 0;
	}

	.current-session {
		font-size: 13px;
		font-weight: 500;
		color: #1e293b;
		margin-left: 10px;
		padding: 20px 15px;
		display: block;
	}

	.sidebar-menu {
		padding: 10px 0;
	}

	.menu-group {
		margin-bottom: 2px;
	}

	.group-header {
		display: flex;
		align-items: center;
		padding: 10px 15px;
		cursor: pointer;
		color: #5a6a85;
		transition: background 0.2s;
		gap: 0.5rem;
		margin: 0 3px 0 10px;
		border-radius: 8px;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	/* .group-header:hover {
		background: #f5f8fa;
	} */

	.group-header.active {
		background: #f5f8fa;
		color: #1e293b;
	}

	.lucide-icon,
	.menu-icon {
		margin-right: 10px;
		color: #64748b;
		flex-shrink: 0;
	}

	.pull-right {
		margin-left: auto;
		color: #64748b;
		transition: transform 0.3s ease;
	}

	.group-header.active .pull-right {
		transform: rotate(180deg);
	}

	.group-items {
		border-radius: 8px;
	}
	.menu-item {
		padding: 0.75rem 1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
        border-left: 2px solid var(--gray2);
	}
	.menu-item {
		display: flex;
		align-items: center;
		padding: 8px 15px 8px 5px;
		color: #5a6a85;
		text-decoration: none;
		transition: all 0.2s;
        margin-left: 35px;
	}
    .menu-item:hover {   border-left: 2px solid blue; }
	/*    
	.menu-item:hover {
		background: #f5f8fa;
		color: #1e293b;
	} */

	.sidebar.collapsed .group-header,
	.sidebar.collapsed .menu-item {
		justify-content: center;
		padding: 12px;
	}

	.sidebar.collapsed .group-header span,
	.sidebar.collapsed .pull-right,
	.sidebar.collapsed .menu-item span {
		display: none;
	}

	
</style>
