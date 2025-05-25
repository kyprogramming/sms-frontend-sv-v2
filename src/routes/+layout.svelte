<script lang="ts">
	import LoadingBar from "$lib/components/LoadingBar.svelte";
	import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
	import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
	import Sidebar from "$lib/components/layouts/Sidebar.svelte";
	import "../app.css";
	import "../app-input.css";

	export let data;
	export let children; 
	let sidebarOpen = true;
</script>

{#if data.user}
	<LoadingBar />
	<div class="app-layout">
		{#if data.role === "admin"}
			<AdminHeader
				user={data.user}
				{sidebarOpen}
				onToggleSidebar={() => (sidebarOpen = !sidebarOpen)}
			/>
			<div class="main-container">
				<div>
					<Sidebar cls={sidebarOpen ? "" : "collapsed"} />
				</div>
				<div class="content">
					{#if children}
						{@render children()}
					{:else}
						<p>Loading...</p>
					{/if}
				</div>
			</div>

		{:else if data.role === "teacher"}
			{#if children}
				{@render children()}
			{:else}
				<p>Loading...</p>
			{/if}

		{:else if data.role === "student"}
			{#if children}
				{@render children()}
			{:else}
				<p>Loading...</p>
			{/if}

		{:else if data.role === "parent"}
			{#if children}
				{@render children()}
			{:else}
				<p>Loading...</p>
			{/if}
		{/if}
	</div>
{:else}
	<!-- Public layout -->
	{#if children}
		{@render children()}
	{:else}
		<p>Loading public content...</p>
	{/if}
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
		box-shadow: inset 0 6px 8px -8px rgba(0, 0, 0, 0.3);
	}
</style>
