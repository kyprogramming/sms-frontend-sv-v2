<script lang="ts">
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/layouts/Sidebar.svelte";
	// export let data;
	// export let children;
    let { data,  children } = $props();
    let sidebarOpen = $state(true);
</script>

<div class="app-layout">
	<AdminHeader
		user={data.user}
		{sidebarOpen}
		onToggleSidebar={() => (sidebarOpen = !sidebarOpen)}
	/>
	<div class="main-container">
		<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
		<div class="content">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.main-container {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.content {
		flex: 1;
		padding: 10px;
		overflow-y: auto;
		background-color: #f8f8f8;
		margin-bottom: 5px;
		box-shadow: inset 0 6px 8px -8px rgba(0, 0, 0, 0.3);
	}
</style>
