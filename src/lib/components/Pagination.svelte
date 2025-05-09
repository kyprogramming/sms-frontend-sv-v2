<script lang="ts">
	import { currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import { get } from "svelte/store";
	import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "@lucide/svelte";

	export let onPaginationChange: () => void;
	export let onPageLimitChange: () => void;

	$currentPage = get(currentPage);
	$rowsPerPage = get(rowsPerPage);
	$totalPages = get(totalPages);
	$totalItems = get(totalItems);

	// Calculate the range for display (e.g., "31-60")
	$: startRange = ($currentPage - 1) * $rowsPerPage + 1;
	$: endRange = Math.min($currentPage * $rowsPerPage, $totalItems);

	// Navigation handlers
	function goToFirstPage() {
		currentPage.set(1);
		onPaginationChange();
	}

	function goToPreviousPage() {
		if ($currentPage > 1) currentPage.set($currentPage - 1);
		onPaginationChange();
	}

	function goToNextPage() {
		if ($currentPage < $totalPages) currentPage.set(($currentPage += 1));
		onPaginationChange();
	}

	function goToLastPage() {
		currentPage.set($totalPages);
		onPaginationChange();
	}

	function handleLimitChange(e: Event) {
		const target = e.target as HTMLSelectElement | null;
		if (target) {
			const limit = parseInt(target.value);
			rowsPerPage.set(limit);
			currentPage.set(1);
			onPageLimitChange();
			onPaginationChange();
		}
	}

	// function changeRowsPerPage(newLimit: number) {
	// 	rowsPerPage.set(newLimit);
	// 	onPaginationChange?.(get(currentPage), newLimit);
	// }
</script>

<div class="pagination">
	<div class="rows-per-page">
		<span>Rows per page:</span>
		<select id="rowsPerPage" style="padding: 4px;" bind:value={$rowsPerPage} on:change={handleLimitChange}>
			<option value={15}>15</option>
			<option value={30}>30</option>
			<option value={50}>50</option>
			<option value={100}>100</option>
		</select>
	</div>
	<div class="range">
		<div class="footer">
			Showing {startRange}-{endRange} of {$totalItems} records
		</div>
	</div>
	<!-- <div class="nav-buttons">
		<button class="nav-button first" on:click={goToFirstPage} disabled={$currentPage === 1}> <span class="icon-wrapper1"><ChevronsLeft /></span></button>
		<button class="nav-button prev" on:click={goToPreviousPage} disabled={$currentPage === 1}><span><ChevronLeft /></span></button>
		<button class="nav-button next" on:click={goToNextPage} disabled={$currentPage === $totalPages}><span><ChevronRight /></span></button>
		<button class="nav-button last" on:click={goToLastPage} disabled={$currentPage === $totalPages}><ChevronsRight /></button>
	</div> -->
	<div class="nav-buttons">
		<button class="nav-button first" on:click={goToFirstPage} disabled={$currentPage === 1}>
			<span class="page-icon-wrapper">
				<ChevronsLeft />
			</span>
		</button>
		<button class="nav-button prev" on:click={goToPreviousPage} disabled={$currentPage === 1}>
			<span class="page-icon-wrapper">
				<ChevronLeft />
			</span>
		</button>
		<button class="nav-button next" on:click={goToNextPage} disabled={$currentPage === $totalPages}>
			<span class="page-icon-wrapper">
				<ChevronRight />
			</span>
		</button>
		<button class="nav-button last" on:click={goToLastPage} disabled={$currentPage === $totalPages}>
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
.nav-button { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 50%; background-color: var(--gray2); color: var(--gray5); cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); box-shadow: var(--shadow-sm); }
.nav-button:hover:not(:disabled) { background-color: #e0e0e0; transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.1); }
.nav-button:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.nav-button:disabled { color: #ccc; background-color: #f8f8f8; cursor: not-allowed; box-shadow: none; }
.first:hover:not(:disabled), .last:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
.prev:hover:not(:disabled), .next:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
.page-icon-wrapper { width: 35px; height: 35px; display: flex; pointer-events: none; margin-top: 16px; margin-left: 1px;}
</style>
