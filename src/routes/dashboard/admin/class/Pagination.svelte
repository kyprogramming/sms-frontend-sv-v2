<script lang="ts">
	export let totalItems: number;
	export let rowsPerPage: number;
	export let currentPage: number = 1;

	// Calculate total pages
	$: totalPages = Math.ceil(totalItems / rowsPerPage);

	// Ensure currentPage stays within bounds
	$: if (currentPage < 1) currentPage = 1;
	$: if (currentPage > totalPages) currentPage = totalPages;

	// Calculate the range for display (e.g., "31-60")
	$: startRange = (currentPage - 1) * rowsPerPage + 1;
	$: endRange = Math.min(currentPage * rowsPerPage, totalItems);

	// Navigation handlers
	function goToFirstPage() {
		currentPage = 1;
	}

	function goToPreviousPage() {
		if (currentPage > 1) currentPage -= 1;
	}

	function goToNextPage() {
		if (currentPage < totalPages) currentPage += 1;
	}

	function goToLastPage() {
		currentPage = totalPages;
	}
</script>

<div class="pagination">
	<div class="rows-per-page">
		<span>Rows per page:</span>
		<select id="rowsPerPage" style="padding: 4px;" bind:value={rowsPerPage} >
			<option value="10">10</option>
			<option value="30">30</option>
			<option value="50">50</option>
		</select>
	</div>
	<div class="range">
		<div class="footer">
			Showing {startRange}-{endRange} of {totalItems} records
		</div>
	</div>
	<div class="nav-buttons">
		<button
			class="nav-button first"
			on:click={goToFirstPage}
			disabled={currentPage === 1}>«</button
		>
		<button
			class="nav-button prev"
			on:click={goToPreviousPage}
			disabled={currentPage === 1}>‹</button
		>
		<button
			class="nav-button next"
			on:click={goToNextPage}
			disabled={currentPage === totalPages}>›</button
		>
		<button
			class="nav-button last"
			on:click={goToLastPage}
			disabled={currentPage === totalPages}>»</button
		>
	</div>
</div>

<!-- prettier-ignore -->
<style>
.pagination { display: flex; align-items: center; justify-content: end; font-family: Arial, sans-serif; font-size: 0.9rem; color: #333; padding: 0.5rem 0; }
.rows-per-page { display: flex; align-items: center; gap: 0.5rem; }
.range { margin: 0 1rem; color: #555; }
.nav-buttons { display: flex; gap: 0.5rem; }
.nav-button { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 50%; background-color: var(--gray2); color: var(--gray5); cursor: pointer; font-size: 1rem; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); box-shadow: var(--shadow-sm); }

.nav-button:hover:not(:disabled) { background-color: #e0e0e0; transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.1); }
.nav-button:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
.nav-button:disabled { color: #ccc; background-color: #f8f8f8; cursor: not-allowed; box-shadow: none; }
.first:hover:not(:disabled), .last:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
.prev:hover:not(:disabled), .next:hover:not(:disabled) { background-color: #94bffa; color: #0066ff; }
</style>
