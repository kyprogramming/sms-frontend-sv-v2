<script lang="ts">
  import { Eye, CheckCircle, XCircle } from '@lucide/svelte';

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
              <Eye size={20} />
              <CheckCircle size={20} />
              <XCircle size={20} />
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
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

.action-icons > * {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.action-icons > *:hover {
  transform: scale(1.1);
}

.footer {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #4b5563;
  text-align: right;
}
</style>