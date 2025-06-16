<script lang="ts">
	let activeTab: string = $state('tab1');

	const tabs = [
		{ id: 'tab1', label: 'Profile' },
		{ id: 'tab2', label: 'Attendance' },
		{ id: 'tab3', label: 'Documents' },
		{ id: 'tab4', label: 'Fees' },
		{ id: 'tab5', label: 'Exam' },
		{ id: 'tab6', label: 'Behavior' },
		{ id: 'tab7', label: 'Timeline' },
	];

	function selectTab(id: string) {
		activeTab = id;
	}
</script>

<div class="tab-header">
	{#each tabs as tab}
		<button class="tab-button {activeTab === tab.id ? 'active' : ''}" onclick={() => selectTab(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>

<div class="tab-panel">
	{#if activeTab === 'tab1'}
		<p>This is the Overview content.</p>
	{:else if activeTab === 'tab2'}
		<p>This is the Documents content.</p>
	{:else if activeTab === 'tab3'}
		<p>This is the Settings content.</p>
	{:else if activeTab === 'tab4'}
		<p>This is the Documents content. Tab 4</p>
	{:else if activeTab === 'tab5'}
		<p>This is the Documents content. Tab 5</p>
	{/if}
</div><!-- prettier-ignore -->
<style>
	.tab-header { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem; }
	.tab-button { padding: 0.75rem 1.5rem; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; font-weight: 500; color: #4a5568; }
	.tab-button.active { border-color: #3182ce; color: #2b6cb0; }
	.tab-panel { padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; }
</style>
