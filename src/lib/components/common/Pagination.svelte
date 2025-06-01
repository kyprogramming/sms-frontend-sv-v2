<script lang="ts">
	import { currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "@lucide/svelte";

	interface Props {
		onPaginationChange: () => void;
		onPageLimitChange: () => void;
	}

	let { onPaginationChange, onPageLimitChange }: Props = $props();

	// Reactive values from stores
	let page = $derived($currentPage);
	let limit = $derived($rowsPerPage);
	let pages = $derived($totalPages);
	let items = $derived($totalItems);

	// Ranges for the pagination display
	let startRange = $derived((page - 1) * limit + 1);
	let endRange = $derived(Math.min(page * limit, items));

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
		<select id="rowsPerPage" bind:value={$rowsPerPage} onchange={handleRowsPerPageChange} aria-label="Rows per page selection">
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
		<button class="nav-button first" onclick={() => navigateToPage(1)} disabled={page === 1} aria-label="First page">
			<span class="page-icon-wrapper">
				<ChevronsLeft />
			</span>
		</button>
		<button class="nav-button prev" onclick={() => navigateToPage(page - 1)} disabled={page === 1} aria-label="Previous page">
			<span class="page-icon-wrapper">
				<ChevronLeft />
			</span>
		</button>
		<button class="nav-button next" onclick={() => navigateToPage(page + 1)} disabled={page === pages} aria-label="Next page">
			<span class="page-icon-wrapper">
				<ChevronRight />
			</span>
		</button>
		<button class="nav-button last" onclick={() => navigateToPage(pages)} disabled={page === pages} aria-label="Last page">
			<span class="page-icon-wrapper">
				<ChevronsRight />
			</span>
		</button>
	</div>
</div>

<!-- prettier-ignore -->
<style>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap; /* Optional: remove if you want everything on one line */
  gap: 1rem;
  color: #333;
}

.rows-per-page,
.range,
.nav-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.rows-per-page label {
  display: flex;
  align-items: center;
  margin: 0;
}


.rows-per-page select {
  height: 30px;
  padding: 0 0.5rem;
  font-size: 14px;
}

.nav-buttons {
  gap: 0.5rem;
}

.nav-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: var(--clr-bg-3);
  color: var(--clr-bg-5);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
}

.nav-button:hover:not(:disabled) {
  background-color: #e0e0e0;
  /* transform: translateY(-1px); */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.nav-button:active:not(:disabled) {
  /* transform: translateY(0); */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.nav-button:disabled {
  color: #ccc;
  background-color: #f8f8f8;
  cursor: not-allowed;
  box-shadow: none;
}

.first:hover:not(:disabled),
.last:hover:not(:disabled),
.prev:hover:not(:disabled),
.next:hover:not(:disabled) {
  background-color: #94bffa;
  color: #0066ff;
}

.page-icon-wrapper {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  margin: 0; /* Removed previous margins that were misaligning icons */
}

</style>
