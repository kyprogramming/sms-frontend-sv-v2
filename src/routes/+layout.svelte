<script lang="ts">
	import LoadingBar from "$lib/components/LoadingBar.svelte";
	import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/layouts/Sidebar.svelte";
	import "../app.css";
	import "../app-input.css";
	
    export let data;
	const { role } = data;
	let sidebarOpen = true;
</script>

{#if data.user}
	<!-- Loading bar global -->
	<LoadingBar />

	<div class="app-container">
		{#if role === "admin"}
			<AdminHeader user={data.user} {sidebarOpen} onToggleSidebar={() => (sidebarOpen = !sidebarOpen)} />
			<div class="main-container">
				<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
			</div>

			<slot />
		{:else if role === "teacher"}
			<!-- <TeacherMenu /> -->
		{:else if role === "student"}
			<!-- <StudentMenu /> -->
		{:else if role === "parent"}
			<!-- <ParentMenu /> -->
		{/if}
	</div>
{:else}
	<!-- Public UI or redirect logic -->
	<slot />
{/if}

<!-- Snackbar global -->
<Snackbar />
