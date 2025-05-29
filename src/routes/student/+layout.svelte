<script lang="ts">
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/layouts/Sidebar.svelte";
	let { data, children } = $props();
	let sidebarOpen = true;
</script>

<div class="app-layout">
	<!-- <AdminHeader
		user={data.user}
		{sidebarOpen}
		onToggleSidebar={() => (sidebarOpen = !sidebarOpen)}
	/> -->
	<div class="main-container">
		<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
		<div class="content">
			{@render children?.()}
		</div>
	</div>
</div>