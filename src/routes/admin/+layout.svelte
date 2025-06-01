<script lang="ts">
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/layouts/Sidebar.svelte";
	// export let data;
	// export let children;
    let { data,  children } = $props();
    let sidebarOpen = $state(true);
    // import { classList } from '$lib/stores/masterData';
    // classList.set(data.classData);
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
	
</style>
