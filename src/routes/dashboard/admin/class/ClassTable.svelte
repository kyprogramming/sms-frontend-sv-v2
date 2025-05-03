<script lang="ts">
  export let classes;
  export let rowsPerPage: number;
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th><input type="checkbox" /></th>
        <th>ID</th>
        <th>NAME</th>
        <th>LEVEL</th>
        <th>ACADEMIC YEAR</th>
        <th>ACTION</th>
      </tr>
    </thead>
    <tbody>
      {#each classes as cls}
        <tr>
          <td><input type="checkbox" /></td>
          <td>#{cls.id}</td>
          <td>{cls.name}</td>
          <td>{cls.level}</td>
          <td>{cls.academicYear}</td>
          <td>
            <span class="action-icons">👁️ ✅ ❌</span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <div class="footer">showing {rowsPerPage} of 60 results</div>
</div>

<style>
  .table-container {
    overflow-x: auto;
    width:100%;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    background-color: #007bff;
    color: white;
    padding: 0.5rem;
    text-align: left;
  }
  td {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  .action-icons {
    display: flex;
    gap: 0.5rem;
  }
  .footer {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
</style>