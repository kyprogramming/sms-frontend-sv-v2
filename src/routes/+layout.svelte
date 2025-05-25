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

{role}
{#if data.user}
	<LoadingBar />
	<div class="app-layout">
		{#if data.role === "admin"}
			<AdminHeader   user={data.user}  {sidebarOpen} onToggleSidebar={() => (sidebarOpen = !sidebarOpen)} />
			<div class="main-container">
				<div>
					<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
				</div>
				<div class="content">
					<slot />
				</div>
			</div>
		{:else if data.role === "teacher"}
			<!-- <TeacherHeader /> -->
			<slot />
		{:else if data.role === "student"}
			<!-- <StudentHeader /> -->
			<slot />
		{:else if data.role === "parent"}
			<!-- <ParentHeader /> -->
			<slot />
		{/if}
	</div>
{:else}
	<!-- Public layout -->
	<slot />
{/if}

<Snackbar />
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
		border: 2px;
		background-color: #f8f8f8;
		margin-bottom: 5px;
		/* border-radius: 10px; */
		box-shadow: inset 0 6px 8px -8px rgba(0, 0, 0, 0.3);
	}
</style>
