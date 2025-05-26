<script lang="ts">
	import { currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "@lucide/svelte";

	export let onPaginationChange: () => void;
	export let onPageLimitChange: () => void;

	// Reactive values from stores
	$: page = $currentPage;
	$: limit = $rowsPerPage;
	$: pages = $totalPages;
	$: items = $totalItems;

	// Ranges for the pagination display
	$: startRange = (page - 1) * limit + 1;
	$: endRange = Math.min(page * limit, items);

	// Navigation actions
	function navigateToPage(newPage: number) {
		if (newPage < 1 || newPage > pages) return;
		currentPage.set(newPage);
		onPaginationChange();
	}

	function handleRowsPerPageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newLimit = parseInt(target.value, 10);
		if (!isNaN(newLimit)) {
			rowsPerPage.set(newLimit);
			currentPage.set(1); // Reset to first page
			onPageLimitChange();
			onPaginationChange();
		}
	}
</script>

<div class="pagination">
	<div class="rows-per-page">
		<label for="rowsPerPage">Rows per page:</label>
		<select id="rowsPerPage" bind:value={$rowsPerPage} on:change={handleRowsPerPageChange} aria-label="Rows per page selection">
			<option value="15">15</option>
			<option value="30">30</option>
			<option value="50">50</option>
			<option value="100">100</option>
		</select>
	</div>

	<div class="range">
		<span>Showing {startRange}-{endRange} of {items} records</span>
	</div>

	<div class="nav-buttons">
		<button class="nav-button first" on:click={() => navigateToPage(1)} disabled={page === 1} aria-label="First page">
			<span class="page-icon-wrapper">
				<ChevronsLeft />
			</span>
		</button>
		<button class="nav-button prev" on:click={() => navigateToPage(page - 1)} disabled={page === 1} aria-label="Previous page">
			<span class="page-icon-wrapper">
				<ChevronLeft />
			</span>
		</button>
		<button class="nav-button next" on:click={() => navigateToPage(page + 1)} disabled={page === pages} aria-label="Next page">
			<span class="page-icon-wrapper">
				<ChevronRight />
			</span>
		</button>
		<button class="nav-button last" on:click={() => navigateToPage(pages)} disabled={page === pages} aria-label="Last page">
			<span class="page-icon-wrapper">
				<ChevronsRight />
			</span>
		</button>
	</div>
</div>

<!-- prettier-ignore -->
<style>
.pagination { display: flex; align-items: center; justify-content: end; color: #333; padding: 0.5rem 0; }
.rows-per-page { display: flex; align-items: center; gap: 0.5rem; }
.range { margin: 0 1rem; color: #555; }
.nav-buttons { display: flex; gap: 0.5rem; }
.nav-button { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 50%; background-color: var(--gray2); color: var(--gray5); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); box-shadow: var(--shadow-sm); }
.nav-button:hover:not(:disabled) { background-color: #e0e0e0; transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.1); }
.nav-button:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.nav-button:disabled { color: #ccc; background-color: #f8f8f8; cursor: not-allowed; box-shadow: none; }
.first:hover:not(:disabled), .last:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
.prev:hover:not(:disabled), .next:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
.page-icon-wrapper { width: 35px; height: 35px; display: flex; pointer-events: none; margin-top: 17px; margin-left: 2px;}
</style>
