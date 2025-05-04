<script lang="ts">
	export let levelFilter: string;
	export let academicYearFilter: string;
	import { Search, Download, Plus } from "@lucide/svelte";
</script>

<div class="filters">
	<div class="filter-group">
		<label for="academicYear">ACADEMIC YEAR</label>
		<select bind:value={academicYearFilter} id="academicYear">
			<option value="2024-2025">2024-2025</option>
			<option value="2022-2023">2022-2023</option>
			<option value="2023-2024">2023-2024</option>
		</select>
	</div>
	<div class="filter-group">
		<label for="name">NAME </label>
		<input type="text" />
	</div>
	<div class="action-buttons">
		<button type="button" class="btn ripple">
			<Search size={16} />
			<span>Search</span>
		</button>

		<button type="button" class="btn ripple">
			<Download size={16} />
			<span>Download</span>
		</button>

		<button type="button" class="btn ripple">
			<Plus size={16} />
			<span>Add Class</span>
		</button>
	</div>
</div>

<style>
	.filters {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 0.5rem;
		padding: 0.1rem;
		border-radius: 8px;
		width: 100%;
		gap: 3rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 6px;
		transition: transform 0.2s ease;
	}

	/* Individual button colors */
	.btn:nth-child(2) {
		background-color: #10b981;
	}

	.btn:nth-child(2):hover {
		background-color: #0eaa74;
	}

	.btn:nth-child(3) {
		background-color: #f59e0b;
	}

	.btn:nth-child(3):hover {
		background-color: #e69009;
	}
</style>
