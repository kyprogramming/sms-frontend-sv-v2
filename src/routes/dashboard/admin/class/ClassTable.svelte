<script lang="ts">
  import { Eye, Edit, Trash2 } from '@lucide/svelte'; // Updated to use Edit for pencil and Trash2 for trash can

  interface Class {
    id: number;
    name: string;
    level: string;
    academicYear: string;
  }

  export let classes: Class[];
  export let rowsPerPage: number;

  let sortColumn = '';
  let sortDirection = 1;

  function sortBy(column: keyof Class) {
    if (sortColumn === column) {
      sortDirection *= -1;
    } else {
      sortColumn = column;
      sortDirection = 1;
    }

    classes = [...classes].sort((a, b) => {
      const valA = a[column]?.toString().toLowerCase() || '';
      const valB = b[column]?.toString().toLowerCase() || '';
      return valA > valB ? sortDirection : valA < valB ? -sortDirection : 0;
    });
  }
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th><input type="checkbox" /></th>
        <th on:click={() => sortBy('id')}>
          ID
          {#if sortColumn === 'id'}
            <span>{sortDirection === 1 ? '↑' : '↓'}</span>
          {/if}
        </th>
        <th on:click={() => sortBy('name')}>
          NAME
          {#if sortColumn === 'name'}
            <span>{sortDirection === 1 ? '↑' : '↓'}</span>
          {/if}
        </th>
        <th on:click={() => sortBy('level')}>
          LEVEL
          {#if sortColumn === 'level'}
            <span>{sortDirection === 1 ? '↑' : '↓'}</span>
          {/if}
        </th>
        <th on:click={() => sortBy('academicYear')}>
          ACADEMIC YEAR
          {#if sortColumn === 'academicYear'}
            <span>{sortDirection === 1 ? '↑' : '↓'}</span>
          {/if}
        </th>
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
            <span class="action-icons">
              <span class="icon-wrapper"><Eye size={20} /></span>
              <span class="icon-wrapper"><Edit size={20} /></span>
              <span class="icon-wrapper"><Trash2 size={20} /></span>
            </span>
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
  width: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  background: linear-gradient(to bottom, #2563eb 0%, #3b82f6 100%);
  color: white;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
  border-right: 0.5px solid white;

}

th:last-child {
  text-align: center;
}

th:hover {
  background: linear-gradient(to bottom, #1e40af 0%, #2563eb 100%);
}
th:last-child {
  text-align: center;
}
th span {
  margin-left: 0.25rem;
  font-size: 0.8rem;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  color: #2d3748;
}

td:last-child {
  text-align: center;
}

tr {
  transition: background 0.2s ease;
}

tr:hover {
  background-color: #f1f5f9;
}

tr:nth-child(even) {
  background-color: #f9fafb;
}

.action-icons {
  display: flex;
  gap: 1rem; /* Increased gap for better spacing */
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; 
  height: 32px;
  border-radius: 50%; 
  transition: all 0.3s ease;
}

/* More vibrant gradient colors with deeper contrast */
.icon-wrapper:nth-child(1) {
  background: linear-gradient(145deg, #5da8ff 0%, #a8d8f8 100%);
  box-shadow: 
    0 4px 8px rgba(93, 168, 255, 0.4),
    inset 0 -2px 2px rgba(255, 255, 255, 0.3),
    inset 0 2px 2px rgba(0, 0, 0, 0.1);
}

.icon-wrapper:nth-child(2) {
  background: linear-gradient(145deg, #4cd964 0%, #a0f5b4 100%);
  box-shadow: 
    0 4px 8px rgba(76, 217, 100, 0.4),
    inset 0 -2px 2px rgba(255, 255, 255, 0.3),
    inset 0 2px 2px rgba(0, 0, 0, 0.1);
}

.icon-wrapper:nth-child(3) {
  background: linear-gradient(145deg, #ff5e7d 0%, #ffb8c6 100%);
  box-shadow: 
    0 4px 8px rgba(255, 94, 125, 0.4),
    inset 0 -2px 2px rgba(255, 255, 255, 0.3),
    inset 0 2px 2px rgba(0, 0, 0, 0.1);
}

/* Hover effects with more depth */
.icon-wrapper:hover {
  transform: translateY(-3px) scale(1);
  box-shadow: 
    0 6px 12px rgba(0, 0, 0, 0.25),
    inset 0 -2px 2px rgba(255, 255, 255, 0.3),
    inset 0 2px 2px rgba(0, 0, 0, 0.1);
}

/* Optional: Add a subtle pulse animation on hover */
@keyframes pulse {
  0% { transform: translateY(-3px) scale(1.2); }
  50% { transform: translateY(-3px) scale(1.25); }
  100% { transform: translateY(-3px) scale(1.2); }
}

.icon-wrapper:hover {
  animation: pulse 1.5s infinite;
}

.footer {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #4b5563;
  text-align: right;
}
</style>