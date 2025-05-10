<script lang="ts">
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	export let data;

	let sidebarOpen = true;
</script>

<div class="layout">
	<AdminHeader user={data.user} {sidebarOpen} onToggleSidebar={() => (sidebarOpen = !sidebarOpen)} />
	<div class="main-container">
		<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
		<div class="content">
			<slot />
		</div>
	</div>
</div>

<style>
	.layout {
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
		border: 2px;
		background-color: #f8f8f8;
		margin-bottom: 5px;
		border-radius: 10px;
		box-shadow: inset 0 6px 8px -8px rgba(0, 0, 0, 0.3);
	}
</style>
