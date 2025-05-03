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
    <label for="rowsPerPage">Rows per page:</label>
    <select bind:value={rowsPerPage} id="rowsPerPage">
      <option value="10">10</option>
      <option value="30">30</option>
      <option value="50">50</option>
    </select>
  </div>
  <div class="range">
    {startRange}-{endRange} of {totalItems}
  </div>
  <div class="nav-buttons">
    <button on:click={goToFirstPage} disabled={currentPage === 1}>«</button>
    <button on:click={goToPreviousPage} disabled={currentPage === 1}>‹</button>
    <button on:click={goToNextPage} disabled={currentPage === totalPages}>›</button>
    <button on:click={goToLastPage} disabled={currentPage === totalPages}>»</button>
  </div>
</div>

<style>
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    font-family: Arial, sans-serif;
    font-size: 0.9rem;
    color: #333;
  }
  .rows-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  label {
    font-weight: normal;
  }
  select {
    padding: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .range {
    margin: 0 1rem;
  }
  .nav-buttons {
    display: flex;
    gap: 0.5rem;
  }
  button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
  }
  button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  button:hover:not(:disabled) {
    background-color: #f0f0f0;
  }
</style>