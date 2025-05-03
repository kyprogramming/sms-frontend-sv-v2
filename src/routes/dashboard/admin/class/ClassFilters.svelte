<script lang="ts">
  export let rowsPerPage: number;
  export let levelFilter: string;
  export let academicYearFilter: string;
</script>

<div class="filters">
  <div class="filter-group">
    <label for="rows">SHOW BY</label>
    <select bind:value={rowsPerPage} id="rows">
      <option value="12">12 Row</option>
      <option value="24">24 Row</option>
      <option value="48">48 Row</option>
    </select>
  </div>
  <div class="filter-group">
    <label for="level">LEVEL</label>
    <select bind:value={levelFilter} id="level">
      <option value="1">Level 1</option>
      <option value="2">Level 2</option>
      <option value="3">Level 3</option>
    </select>
  </div>
  <div class="filter-group">
    <label for="academicYear">ACADEMIC YEAR</label>
    <select bind:value={academicYearFilter} id="academicYear">
      <option value="2022-2023">2022-2023</option>
      <option value="2023-2024">2023-2024</option>
      <option value="2024-2025">2024-2025</option>
    </select>
  </div>
</div>

<style>
  .filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
  }
  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  label {
    font-weight: bold;
    color: #333;
  }
  select {
    padding: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>